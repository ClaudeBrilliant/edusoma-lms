import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { FileStorageService } from '../../shared/services/file-storage.service';
import { MailService } from '../mail/mail.service';
import {
  Certificate,
  CertificateWithDetails,
  CreateCertificateDto,
  CertificateVerificationResult,
  CertificateTemplate,
} from './interfaces/certificate.interface';
import { randomBytes } from 'crypto';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CertificatesService {
  constructor(
    private prisma: PrismaService,
    private fileStorageService: FileStorageService,
    private mailService: MailService,
  ) {}

  async createCertificate(
    createCertificateDto: CreateCertificateDto,
    instructorId: string,
  ): Promise<Certificate> {
    // Verify the instructor has permission to create certificates for this course
    const course = await this.prisma.course.findFirst({
      where: {
        id: createCertificateDto.courseId,
        instructorId,
      },
    });

    if (!course) {
      throw new ForbiddenException(
        'You can only create certificates for your own courses',
      );
    }

    // Verify the enrollment exists and belongs to the user
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        id: createCertificateDto.enrollmentId,
        userId: createCertificateDto.userId,
        courseId: createCertificateDto.courseId,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Generate unique certificate number and verification code
    const certificateNumber = this.generateCertificateNumber();
    const verificationCode = this.generateVerificationCode();

    // Create certificate record
    const certificate = await this.prisma.certificate.create({
      data: {
        userId: createCertificateDto.userId,
        courseId: createCertificateDto.courseId,
        enrollmentId: createCertificateDto.enrollmentId,
        certificateNumber,
        verificationCode,
        type: createCertificateDto.type,
        issuedAt: new Date(),
        expiresAt: createCertificateDto.expiresAt
          ? new Date(createCertificateDto.expiresAt)
          : null,
        status: 'ACTIVE',
        metadata: createCertificateDto.metadata || {},
      },
    });

    // Generate PDF certificate
    const pdfResult = await this.generateCertificatePDF(certificate.id);

    // Update certificate with PDF URL
    const updatedCertificate = await this.prisma.certificate.update({
      where: { id: certificate.id },
      data: { certificateUrl: pdfResult },
    });

    // Send email notification to student
    await this.sendCertificateEmail(certificate.id);

    return updatedCertificate as Certificate;
  }

  async generateCertificateForCourseCompletion(
    enrollmentId: string,
    userId: string,
  ): Promise<Certificate> {
    // Get enrollment with course details
    const enrollment = await this.prisma.enrollment.findFirst({
      where: {
        id: enrollmentId,
        userId,
      },
      include: {
        course: {
          include: {
            instructor: true,
          },
        },
        user: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundException('Enrollment not found');
    }

    // Check if certificate already exists
    const existingCertificate = await this.prisma.certificate.findFirst({
      where: {
        enrollmentId,
        type: 'COMPLETION',
      },
    });

    if (existingCertificate) {
      return existingCertificate as Certificate;
    }

    // Create completion certificate
    const createCertificateDto: CreateCertificateDto = {
      userId,
      courseId: enrollment.courseId,
      enrollmentId,
      type: 'COMPLETION',
    };

    return this.createCertificate(
      createCertificateDto,
      enrollment.course.instructorId,
    );
  }

  async findAll(): Promise<CertificateWithDetails[]> {
    return this.prisma.certificate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            enrolledAt: true,
          },
        },
      },
    }) as Promise<CertificateWithDetails[]>;
  }

  async findByUser(userId: string): Promise<CertificateWithDetails[]> {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            enrolledAt: true,
          },
        },
      },
    }) as Promise<CertificateWithDetails[]>;
  }

  async findOne(id: string, userId: string): Promise<CertificateWithDetails> {
    const certificate = await this.prisma.certificate.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            enrolledAt: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    return certificate as CertificateWithDetails;
  }

  async verifyCertificate(
    verificationCode: string,
  ): Promise<CertificateVerificationResult> {
    const certificate = await this.prisma.certificate.findFirst({
      where: {
        verificationCode,
        status: 'ACTIVE',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            description: true,
          },
        },
        enrollment: {
          select: {
            id: true,
            enrolledAt: true,
          },
        },
      },
    });

    if (!certificate) {
      return {
        isValid: false,
        reason: 'Certificate not found or invalid verification code',
      };
    }

    // Check if certificate is expired
    if (certificate.expiresAt && certificate.expiresAt < new Date()) {
      return {
        isValid: false,
        reason: 'Certificate has expired',
      };
    }

    return {
      isValid: true,
      certificate: certificate as CertificateWithDetails,
    };
  }

  async revokeCertificate(
    id: string,
    instructorId: string,
  ): Promise<Certificate> {
    const certificate = await this.prisma.certificate.findFirst({
      where: { id },
      include: {
        course: {
          select: {
            instructorId: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    if (certificate.course.instructorId !== instructorId) {
      throw new ForbiddenException(
        'You can only revoke certificates for your own courses',
      );
    }

    return this.prisma.certificate.update({
      where: { id },
      data: { status: 'REVOKED' },
    }) as Promise<Certificate>;
  }

  private generateCertificateNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = randomBytes(4).toString('hex');
    return `CERT-${timestamp}-${random}`.toUpperCase();
  }

  private generateVerificationCode(): string {
    return randomBytes(16).toString('hex');
  }

  private async generateCertificatePDF(certificateId: string): Promise<string> {
    // Get certificate data with all details
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        course: {
          select: {
            title: true,
            instructor: {
              select: {
                name: true,
              },
            },
          },
        },
        enrollment: {
          select: {
            enrolledAt: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    // Create certificate template data
    const templateData: CertificateTemplate = {
      studentName: certificate.user.name,
      courseName: certificate.course.title,
      completionDate: certificate.issuedAt.toLocaleDateString(),
      instructorName: certificate.course.instructor.name,
      certificateNumber: certificate.certificateNumber,
      verificationCode: certificate.verificationCode,
    };

    // Generate HTML content
    const htmlContent = this.generateCertificateHTML(templateData);
    
    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({ 
      args: ['--no-sandbox', '--disable-setuid-sandbox'] 
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
    await browser.close();

    // Save PDF locally
    const result = await this.fileStorageService.saveCertificatePDF(
      Buffer.from(pdfBuffer),
      certificate.certificateNumber,
    );

    return result.downloadUrl;
  }

  private generateCertificateHTML(template: CertificateTemplate): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate of Completion</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              margin: 0;
              padding: 40px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .certificate {
              background: white;
              padding: 60px;
              border-radius: 20px;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
              text-align: center;
              max-width: 800px;
              width: 100%;
            }
            .header {
              color: #333;
              margin-bottom: 40px;
            }
            .title {
              font-size: 48px;
              font-weight: bold;
              color: #2c3e50;
              margin-bottom: 10px;
            }
            .subtitle {
              font-size: 24px;
              color: #7f8c8d;
              margin-bottom: 50px;
            }
            .content {
              font-size: 18px;
              line-height: 1.6;
              color: #34495e;
              margin-bottom: 40px;
            }
            .student-name {
              font-size: 32px;
              font-weight: bold;
              color: #e74c3c;
              margin: 20px 0;
            }
            .course-name {
              font-size: 24px;
              color: #3498db;
              margin: 20px 0;
            }
            .details {
              display: flex;
              justify-content: space-between;
              margin: 40px 0;
              font-size: 14px;
              color: #7f8c8d;
            }
            .signature {
              margin-top: 60px;
              border-top: 2px solid #bdc3c7;
              padding-top: 20px;
            }
            .verification {
              margin-top: 30px;
              font-size: 12px;
              color: #95a5a6;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">Certificate of Completion</div>
              <div class="subtitle">This is to certify that</div>
            </div>
            
            <div class="content">
              <div class="student-name">${template.studentName}</div>
              <div>has successfully completed the course</div>
              <div class="course-name">${template.courseName}</div>
              <div>on ${template.completionDate}</div>
            </div>
            
            <div class="details">
              <div>
                <strong>Certificate Number:</strong><br>
                ${template.certificateNumber}
              </div>
              <div>
                <strong>Instructor:</strong><br>
                ${template.instructorName}
              </div>
            </div>
            
            <div class="signature">
              <div style="float: left; width: 45%;">
                <div style="border-top: 1px solid #000; margin-top: 50px; padding-top: 10px;">
                  ${template.instructorName}<br>
                  <small>Instructor</small>
                </div>
              </div>
              <div style="float: right; width: 45%;">
                <div style="border-top: 1px solid #000; margin-top: 50px; padding-top: 10px;">
                  Date<br>
                  <small>${template.completionDate}</small>
                </div>
              </div>
              <div style="clear: both;"></div>
            </div>
            
            <div class="verification">
              <strong>Verification Code:</strong> ${template.verificationCode}<br>
              This certificate can be verified at our platform.
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private async sendCertificateEmail(certificateId: string): Promise<void> {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!certificate) {
      throw new NotFoundException('Certificate not found');
    }

    await this.mailService.sendCertificateEmail({
      to: certificate.user.email,
      studentName: certificate.user.name,
      courseName: certificate.course.title,
      certificateUrl: certificate.certificateUrl!,
      certificateNumber: certificate.certificateNumber,
    });
  }
}