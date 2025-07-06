import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { FileStorageService } from '../../shared/services/file-storage.service';
import { createReadStream } from 'fs';

@Controller('certificates')
export class CertificatesController {
  constructor(
    private readonly certificatesService: CertificatesService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  @Post()
  @Roles('INSTRUCTOR', 'ADMIN')
  async createCertificate(
    @Body() createCertificateDto: CreateCertificateDto,
    @CurrentUser() user: any,
  ) {
    return this.certificatesService.createCertificate(
      createCertificateDto,
      user.sub,
    );
  }

  @Post('generate-for-completion/:enrollmentId')
  @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
  async generateCertificateForCompletion(
    @Param('enrollmentId') enrollmentId: string,
    @CurrentUser() user: any,
  ) {
    return this.certificatesService.generateCertificateForCourseCompletion(
      enrollmentId,
      user.sub,
    );
  }

  @Get()
  @Roles('ADMIN')
  async findAll() {
    return this.certificatesService.findAll();
  }

  @Get('my-certificates')
  @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
  async findMyCertificates(@CurrentUser() user: any) {
    return this.certificatesService.findByUser(user.sub);
  }

  @Get(':id')
  @Roles('STUDENT', 'INSTRUCTOR', 'ADMIN')
  async findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.certificatesService.findOne(id, user.sub);
  }

  @Get('verify/:verificationCode')
  @Public()
  async verifyCertificate(@Param('verificationCode') verificationCode: string) {
    return this.certificatesService.verifyCertificate(verificationCode);
  }

  @Post(':id/revoke')
  @Roles('INSTRUCTOR', 'ADMIN')
  async revokeCertificate(@Param('id') id: string, @CurrentUser() user: any) {
    return this.certificatesService.revokeCertificate(id, user.sub);
  }

  @Get('download/:fileName')
  @Public()
  async downloadCertificate(
    @Param('fileName') fileName: string,
    @Res() res: Response,
  ) {
    try {
      const filePath = this.fileStorageService.getFilePath(fileName);
      const fileExists = await this.fileStorageService.fileExists(filePath);
      
      if (!fileExists) {
        return res.status(HttpStatus.NOT_FOUND).send('Certificate file not found');
      }

      const fileStream = createReadStream(filePath);
      
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Type', 'application/pdf');
      
      fileStream.pipe(res);
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error downloading certificate');
    }
  }
}
