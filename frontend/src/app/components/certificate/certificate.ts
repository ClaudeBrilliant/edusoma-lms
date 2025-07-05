import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CertificateService, Certificate, CertificateTemplate, CertificateRequest, CertificateStats } from '../../services/certificate.service';

@Component({
  selector: 'app-certificate',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './certificate.html',
  styleUrl: './certificate.css'
})
export class CertificateComponent implements OnInit {
  certificates: Certificate[] = [];
  templates: CertificateTemplate[] = [];
  requests: CertificateRequest[] = [];
  stats: CertificateStats | null = null;
  loading = true;
  selectedTab = 'certificates';
  searchTerm = '';
  selectedStatus = 'all';
  verificationNumber = '';

  constructor(private certificateService: CertificateService) {}

  ngOnInit(): void {
    this.loadCertificateData();
  }

  loadCertificateData(): void {
    // Using mock data for development
    this.certificates = this.certificateService.getMockCertificates();
    this.templates = this.certificateService.getMockTemplates();
    this.requests = this.certificateService.getMockCertificateRequests();
    this.stats = this.certificateService.getMockCertificateStats();
    this.loading = false;
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'text-green-500 bg-green-100';
      case 'EXPIRED':
        return 'text-yellow-500 bg-yellow-100';
      case 'REVOKED':
        return 'text-red-500 bg-red-100';
      case 'PENDING':
        return 'text-blue-500 bg-blue-100';
      case 'APPROVED':
        return 'text-green-500 bg-green-100';
      case 'REJECTED':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'fas fa-check-circle';
      case 'EXPIRED':
        return 'fas fa-clock';
      case 'REVOKED':
        return 'fas fa-ban';
      case 'PENDING':
        return 'fas fa-hourglass-half';
      case 'APPROVED':
        return 'fas fa-check-circle';
      case 'REJECTED':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-question-circle';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  downloadCertificate(certificate: Certificate): void {
    // TODO: Implement certificate download
    console.log('Downloading certificate:', certificate.certificateNumber);
  }

  viewCertificate(certificate: Certificate): void {
    // TODO: Implement certificate preview
    console.log('Viewing certificate:', certificate.certificateNumber);
  }

  revokeCertificate(certificate: Certificate): void {
    // TODO: Implement certificate revocation
    console.log('Revoking certificate:', certificate.certificateNumber);
  }

  approveRequest(request: CertificateRequest): void {
    // TODO: Implement request approval
    console.log('Approving request:', request.id);
  }

  rejectRequest(request: CertificateRequest): void {
    // TODO: Implement request rejection
    console.log('Rejecting request:', request.id);
  }

  verifyCertificate(): void {
    if (this.verificationNumber.trim()) {
      // TODO: Implement certificate verification
      console.log('Verifying certificate:', this.verificationNumber);
    }
  }

  getFilteredCertificates(): Certificate[] {
    let filtered = this.certificates;

    if (this.searchTerm) {
      filtered = filtered.filter(cert => 
        cert.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        cert.certificateNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(cert => cert.status === this.selectedStatus);
    }

    return filtered;
  }

  getFilteredRequests(): CertificateRequest[] {
    let filtered = this.requests;

    if (this.searchTerm) {
      filtered = filtered.filter(req => 
        req.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        req.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(req => req.status === this.selectedStatus);
    }

    return filtered;
  }

  getActiveCertificates(): Certificate[] {
    return this.certificates.filter(cert => cert.status === 'ACTIVE');
  }

  getExpiredCertificates(): Certificate[] {
    return this.certificates.filter(cert => cert.status === 'EXPIRED');
  }

  getRevokedCertificates(): Certificate[] {
    return this.certificates.filter(cert => cert.status === 'REVOKED');
  }

  getPendingRequests(): CertificateRequest[] {
    return this.requests.filter(req => req.status === 'PENDING');
  }

  isCertificateExpired(certificate: Certificate): boolean {
    if (!certificate.validUntil) return false;
    return new Date() > new Date(certificate.validUntil);
  }

  getDaysUntilExpiry(certificate: Certificate): number {
    if (!certificate.validUntil) return -1;
    const today = new Date();
    const expiryDate = new Date(certificate.validUntil);
    const diffTime = expiryDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getExpiryStatus(certificate: Certificate): string {
    if (!certificate.validUntil) return 'No expiry date';
    
    const daysUntilExpiry = this.getDaysUntilExpiry(certificate);
    
    if (daysUntilExpiry < 0) return 'Expired';
    if (daysUntilExpiry <= 30) return 'Expiring soon';
    if (daysUntilExpiry <= 90) return 'Expiring in 3 months';
    return 'Valid';
  }

  getExpiryColor(certificate: Certificate): string {
    const daysUntilExpiry = this.getDaysUntilExpiry(certificate);
    
    if (daysUntilExpiry < 0) return 'text-red-500';
    if (daysUntilExpiry <= 30) return 'text-yellow-500';
    if (daysUntilExpiry <= 90) return 'text-orange-500';
    return 'text-green-500';
  }
}
