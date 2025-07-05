import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  issuedAt: Date;
  url: string;
  status: 'ACTIVE' | 'EXPIRED' | 'REVOKED';
  certificateNumber: string;
  grade?: string;
  completionDate: Date;
  instructorName: string;
  validUntil?: Date;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  design: string; // JSON string containing design configuration
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CertificateRequest {
  id: string;
  userId: string;
  userName: string;
  courseId: string;
  courseTitle: string;
  requestedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  reason?: string;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface CertificateStats {
  totalIssued: number;
  totalPending: number;
  totalExpired: number;
  totalRevoked: number;
  monthlyIssued: number;
  averageCompletionTime: number; // in days
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Certificate Management
  getCertificates(): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/certificates`);
  }

  getCertificateById(id: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/${id}`);
  }

  getUserCertificates(userId: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/users/${userId}/certificates`);
  }

  getCourseCertificates(courseId: string): Observable<Certificate[]> {
    return this.http.get<Certificate[]>(`${this.apiUrl}/courses/${courseId}/certificates`);
  }

  issueCertificate(certificateData: Partial<Certificate>): Observable<Certificate> {
    return this.http.post<Certificate>(`${this.apiUrl}/certificates`, certificateData);
  }

  revokeCertificate(id: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/certificates/${id}/revoke`, { reason });
  }

  downloadCertificate(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/certificates/${id}/download`, { responseType: 'blob' });
  }

  verifyCertificate(certificateNumber: string): Observable<Certificate> {
    return this.http.get<Certificate>(`${this.apiUrl}/certificates/verify/${certificateNumber}`);
  }

  // Certificate Templates
  getTemplates(): Observable<CertificateTemplate[]> {
    return this.http.get<CertificateTemplate[]>(`${this.apiUrl}/certificate-templates`);
  }

  createTemplate(template: Partial<CertificateTemplate>): Observable<CertificateTemplate> {
    return this.http.post<CertificateTemplate>(`${this.apiUrl}/certificate-templates`, template);
  }

  updateTemplate(id: string, template: Partial<CertificateTemplate>): Observable<CertificateTemplate> {
    return this.http.put<CertificateTemplate>(`${this.apiUrl}/certificate-templates/${id}`, template);
  }

  deleteTemplate(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/certificate-templates/${id}`);
  }

  // Certificate Requests
  getRequests(): Observable<CertificateRequest[]> {
    return this.http.get<CertificateRequest[]>(`${this.apiUrl}/certificate-requests`);
  }

  approveRequest(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/certificate-requests/${id}/approve`, {});
  }

  rejectRequest(id: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/certificate-requests/${id}/reject`, { reason });
  }

  // Analytics
  getCertificateStats(): Observable<CertificateStats> {
    return this.http.get<CertificateStats>(`${this.apiUrl}/certificates/stats`);
  }

  // Mock data for development
  getMockCertificates(): Certificate[] {
    return [
      {
        id: '1',
        userId: 'user1',
        userName: 'John Doe',
        courseId: 'course1',
        courseTitle: 'Introduction to Web Development',
        issuedAt: new Date('2024-01-15'),
        url: '/certificates/1.pdf',
        status: 'ACTIVE',
        certificateNumber: 'CERT-2024-001',
        grade: 'A+',
        completionDate: new Date('2024-01-10'),
        instructorName: 'Dr. Sarah Johnson',
        validUntil: new Date('2027-01-15')
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Jane Smith',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        issuedAt: new Date('2024-01-20'),
        url: '/certificates/2.pdf',
        status: 'ACTIVE',
        certificateNumber: 'CERT-2024-002',
        grade: 'A',
        completionDate: new Date('2024-01-18'),
        instructorName: 'Prof. Michael Chen',
        validUntil: new Date('2027-01-20')
      },
      {
        id: '3',
        userId: 'user3',
        userName: 'Bob Wilson',
        courseId: 'course3',
        courseTitle: 'Data Science Fundamentals',
        issuedAt: new Date('2023-12-15'),
        url: '/certificates/3.pdf',
        status: 'ACTIVE',
        certificateNumber: 'CERT-2023-015',
        grade: 'B+',
        completionDate: new Date('2023-12-10'),
        instructorName: 'Dr. Emily Davis',
        validUntil: new Date('2026-12-15')
      },
      {
        id: '4',
        userId: 'user4',
        userName: 'Alice Brown',
        courseId: 'course1',
        courseTitle: 'Introduction to Web Development',
        issuedAt: new Date('2023-11-20'),
        url: '/certificates/4.pdf',
        status: 'EXPIRED',
        certificateNumber: 'CERT-2023-010',
        grade: 'A-',
        completionDate: new Date('2023-11-15'),
        instructorName: 'Dr. Sarah Johnson',
        validUntil: new Date('2023-11-20')
      },
      {
        id: '5',
        userId: 'user5',
        userName: 'Charlie Davis',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        issuedAt: new Date('2023-10-10'),
        url: '/certificates/5.pdf',
        status: 'REVOKED',
        certificateNumber: 'CERT-2023-008',
        grade: 'C',
        completionDate: new Date('2023-10-05'),
        instructorName: 'Prof. Michael Chen',
        validUntil: new Date('2026-10-10')
      }
    ];
  }

  getMockCertificateStats(): CertificateStats {
    return {
      totalIssued: 156,
      totalPending: 12,
      totalExpired: 8,
      totalRevoked: 3,
      monthlyIssued: 23,
      averageCompletionTime: 45
    };
  }

  getMockCertificateRequests(): CertificateRequest[] {
    return [
      {
        id: '1',
        userId: 'user6',
        userName: 'David Lee',
        courseId: 'course1',
        courseTitle: 'Introduction to Web Development',
        requestedAt: new Date('2024-01-22'),
        status: 'PENDING'
      },
      {
        id: '2',
        userId: 'user7',
        userName: 'Emma Wilson',
        courseId: 'course3',
        courseTitle: 'Data Science Fundamentals',
        requestedAt: new Date('2024-01-21'),
        status: 'APPROVED',
        approvedBy: 'Dr. Sarah Johnson',
        approvedAt: new Date('2024-01-22')
      },
      {
        id: '3',
        userId: 'user8',
        userName: 'Frank Miller',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        requestedAt: new Date('2024-01-20'),
        status: 'REJECTED',
        reason: 'Incomplete course requirements',
        approvedBy: 'Prof. Michael Chen',
        approvedAt: new Date('2024-01-21')
      }
    ];
  }

  getMockTemplates(): CertificateTemplate[] {
    return [
      {
        id: '1',
        name: 'Classic Template',
        description: 'Traditional certificate design with gold borders',
        design: JSON.stringify({
          backgroundColor: '#ffffff',
          borderColor: '#d4af37',
          textColor: '#000000',
          logo: '/assets/logo.png'
        }),
        isDefault: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      },
      {
        id: '2',
        name: 'Modern Template',
        description: 'Clean and modern design with blue accents',
        design: JSON.stringify({
          backgroundColor: '#f8fafc',
          borderColor: '#3b82f6',
          textColor: '#1e293b',
          logo: '/assets/logo-modern.png'
        }),
        isDefault: false,
        createdAt: new Date('2023-06-15'),
        updatedAt: new Date('2023-06-15')
      },
      {
        id: '3',
        name: 'Professional Template',
        description: 'Corporate-style certificate with dark theme',
        design: JSON.stringify({
          backgroundColor: '#1e293b',
          borderColor: '#64748b',
          textColor: '#ffffff',
          logo: '/assets/logo-dark.png'
        }),
        isDefault: false,
        createdAt: new Date('2023-09-20'),
        updatedAt: new Date('2023-09-20')
      }
    ];
  }
} 