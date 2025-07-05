import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  enrollmentDate: Date;
  status: 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'PENDING' | 'WAITLISTED' | 'REJECTED';
  completionDate?: Date;
  progress: number; // percentage
  grade?: string;
  certificateEarned: boolean;
  paymentStatus: 'PAID' | 'PENDING' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  lastActivityDate: Date;
  totalModules: number;
  completedModules: number;
  totalAssignments: number;
  completedAssignments: number;
  totalQuizzes: number;
  completedQuizzes: number;
}

export interface EnrollmentApplication {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  applicationDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
  reason?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  documents?: string[]; // URLs to uploaded documents
  notes?: string;
}

export interface EnrollmentStats {
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  pendingApplications: number;
  waitlistedStudents: number;
  averageCompletionRate: number;
  monthlyEnrollments: number;
  revenueThisMonth: number;
  topCourses: { courseId: string; courseTitle: string; enrollments: number }[];
}

export interface CourseEnrollmentData {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  activeEnrollments: number;
  completedEnrollments: number;
  averageProgress: number;
  averageGrade: string;
  revenue: number;
  enrollmentTrend: { month: string; enrollments: number }[];
}

export interface StudentEnrollmentHistory {
  studentId: string;
  studentName: string;
  enrollments: Enrollment[];
  totalCourses: number;
  completedCourses: number;
  averageGrade: string;
  totalSpent: number;
  certificatesEarned: number;
}

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Enrollment Management
  getEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/enrollments`);
  }

  getEnrollmentById(id: string): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}/enrollments/${id}`);
  }

  getStudentEnrollments(studentId: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/students/${studentId}/enrollments`);
  }

  getCourseEnrollments(courseId: string): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/courses/${courseId}/enrollments`);
  }

  createEnrollment(enrollment: Partial<Enrollment>): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/enrollments`, enrollment);
  }

  updateEnrollment(id: string, enrollment: Partial<Enrollment>): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/enrollments/${id}`, enrollment);
  }

  dropEnrollment(id: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollments/${id}/drop`, { reason });
  }

  completeEnrollment(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollments/${id}/complete`, {});
  }

  // Application Management
  getApplications(): Observable<EnrollmentApplication[]> {
    return this.http.get<EnrollmentApplication[]>(`${this.apiUrl}/enrollment-applications`);
  }

  getApplicationById(id: string): Observable<EnrollmentApplication> {
    return this.http.get<EnrollmentApplication>(`${this.apiUrl}/enrollment-applications/${id}`);
  }

  submitApplication(application: Partial<EnrollmentApplication>): Observable<EnrollmentApplication> {
    return this.http.post<EnrollmentApplication>(`${this.apiUrl}/enrollment-applications`, application);
  }

  approveApplication(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollment-applications/${id}/approve`, {});
  }

  rejectApplication(id: string, reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollment-applications/${id}/reject`, { reason });
  }

  waitlistApplication(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollment-applications/${id}/waitlist`, {});
  }

  // Analytics
  getEnrollmentStats(): Observable<EnrollmentStats> {
    return this.http.get<EnrollmentStats>(`${this.apiUrl}/enrollments/stats`);
  }

  getCourseEnrollmentData(courseId: string): Observable<CourseEnrollmentData> {
    return this.http.get<CourseEnrollmentData>(`${this.apiUrl}/courses/${courseId}/enrollment-data`);
  }

  getStudentEnrollmentHistory(studentId: string): Observable<StudentEnrollmentHistory> {
    return this.http.get<StudentEnrollmentHistory>(`${this.apiUrl}/students/${studentId}/enrollment-history`);
  }

  // Bulk Operations
  bulkApproveApplications(applicationIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollment-applications/bulk-approve`, { applicationIds });
  }

  bulkRejectApplications(applicationIds: string[], reason: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/enrollment-applications/bulk-reject`, { applicationIds, reason });
  }

  // Mock data for development
  getMockEnrollments(): Enrollment[] {
    return [
      {
        id: '1',
        studentId: 'student1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@email.com',
        courseId: 'course1',
        courseTitle: 'Web Development Fundamentals',
        instructorId: 'instructor1',
        instructorName: 'Dr. Sarah Johnson',
        enrollmentDate: new Date('2024-01-15'),
        status: 'ACTIVE',
        progress: 75,
        grade: 'A-',
        certificateEarned: false,
        paymentStatus: 'PAID',
        amount: 299.99,
        currency: 'USD',
        lastActivityDate: new Date('2024-01-28'),
        totalModules: 12,
        completedModules: 9,
        totalAssignments: 8,
        completedAssignments: 6,
        totalQuizzes: 6,
        completedQuizzes: 5
      },
      {
        id: '2',
        studentId: 'student2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@email.com',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        instructorId: 'instructor2',
        instructorName: 'Prof. Michael Chen',
        enrollmentDate: new Date('2024-01-10'),
        status: 'COMPLETED',
        completionDate: new Date('2024-02-15'),
        progress: 100,
        grade: 'A+',
        certificateEarned: true,
        paymentStatus: 'PAID',
        amount: 399.99,
        currency: 'USD',
        lastActivityDate: new Date('2024-02-15'),
        totalModules: 15,
        completedModules: 15,
        totalAssignments: 10,
        completedAssignments: 10,
        totalQuizzes: 8,
        completedQuizzes: 8
      },
      {
        id: '3',
        studentId: 'student3',
        studentName: 'Bob Wilson',
        studentEmail: 'bob.wilson@email.com',
        courseId: 'course1',
        courseTitle: 'Web Development Fundamentals',
        instructorId: 'instructor1',
        instructorName: 'Dr. Sarah Johnson',
        enrollmentDate: new Date('2024-01-20'),
        status: 'ACTIVE',
        progress: 45,
        grade: 'B+',
        certificateEarned: false,
        paymentStatus: 'PAID',
        amount: 299.99,
        currency: 'USD',
        lastActivityDate: new Date('2024-01-27'),
        totalModules: 12,
        completedModules: 5,
        totalAssignments: 8,
        completedAssignments: 3,
        totalQuizzes: 6,
        completedQuizzes: 2
      },
      {
        id: '4',
        studentId: 'student4',
        studentName: 'Alice Brown',
        studentEmail: 'alice.brown@email.com',
        courseId: 'course3',
        courseTitle: 'Data Science Fundamentals',
        instructorId: 'instructor3',
        instructorName: 'Dr. Emily Davis',
        enrollmentDate: new Date('2024-01-05'),
        status: 'DROPPED',
        progress: 30,
        grade: 'C',
        certificateEarned: false,
        paymentStatus: 'REFUNDED',
        amount: 499.99,
        currency: 'USD',
        lastActivityDate: new Date('2024-01-25'),
        totalModules: 18,
        completedModules: 5,
        totalAssignments: 12,
        completedAssignments: 2,
        totalQuizzes: 10,
        completedQuizzes: 1
      },
      {
        id: '5',
        studentId: 'student5',
        studentName: 'Charlie Davis',
        studentEmail: 'charlie.davis@email.com',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        instructorId: 'instructor2',
        instructorName: 'Prof. Michael Chen',
        enrollmentDate: new Date('2024-01-12'),
        status: 'WAITLISTED',
        progress: 0,
        certificateEarned: false,
        paymentStatus: 'PENDING',
        amount: 399.99,
        currency: 'USD',
        lastActivityDate: new Date('2024-01-12'),
        totalModules: 15,
        completedModules: 0,
        totalAssignments: 10,
        completedAssignments: 0,
        totalQuizzes: 8,
        completedQuizzes: 0
      }
    ];
  }

  getMockApplications(): EnrollmentApplication[] {
    return [
      {
        id: '1',
        studentId: 'student6',
        studentName: 'David Lee',
        studentEmail: 'david.lee@email.com',
        courseId: 'course1',
        courseTitle: 'Web Development Fundamentals',
        applicationDate: new Date('2024-01-30'),
        status: 'PENDING',
        documents: ['/uploads/transcript.pdf', '/uploads/resume.pdf'],
        notes: 'Student shows strong interest in web development'
      },
      {
        id: '2',
        studentId: 'student7',
        studentName: 'Emma Wilson',
        studentEmail: 'emma.wilson@email.com',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        applicationDate: new Date('2024-01-29'),
        status: 'APPROVED',
        approvedBy: 'Prof. Michael Chen',
        approvedAt: new Date('2024-01-30'),
        documents: ['/uploads/portfolio.pdf'],
        notes: 'Excellent portfolio, approved for advanced course'
      },
      {
        id: '3',
        studentId: 'student8',
        studentName: 'Frank Miller',
        studentEmail: 'frank.miller@email.com',
        courseId: 'course3',
        courseTitle: 'Data Science Fundamentals',
        applicationDate: new Date('2024-01-28'),
        status: 'REJECTED',
        rejectionReason: 'Insufficient background in mathematics',
        documents: ['/uploads/transcript.pdf'],
        notes: 'Student needs to complete prerequisite math courses'
      }
    ];
  }

  getMockEnrollmentStats(): EnrollmentStats {
    return {
      totalEnrollments: 156,
      activeEnrollments: 89,
      completedEnrollments: 45,
      pendingApplications: 12,
      waitlistedStudents: 8,
      averageCompletionRate: 78.5,
      monthlyEnrollments: 23,
      revenueThisMonth: 6899.97,
      topCourses: [
        { courseId: 'course1', courseTitle: 'Web Development Fundamentals', enrollments: 45 },
        { courseId: 'course2', courseTitle: 'Advanced React Development', enrollments: 38 },
        { courseId: 'course3', courseTitle: 'Data Science Fundamentals', enrollments: 32 }
      ]
    };
  }

  getMockCourseEnrollmentData(): CourseEnrollmentData[] {
    return [
      {
        courseId: 'course1',
        courseTitle: 'Web Development Fundamentals',
        totalEnrollments: 45,
        activeEnrollments: 32,
        completedEnrollments: 13,
        averageProgress: 68.5,
        averageGrade: 'B+',
        revenue: 13499.55,
        enrollmentTrend: [
          { month: 'Jan', enrollments: 15 },
          { month: 'Feb', enrollments: 18 },
          { month: 'Mar', enrollments: 12 }
        ]
      },
      {
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        totalEnrollments: 38,
        activeEnrollments: 25,
        completedEnrollments: 13,
        averageProgress: 72.3,
        averageGrade: 'A-',
        revenue: 15199.62,
        enrollmentTrend: [
          { month: 'Jan', enrollments: 12 },
          { month: 'Feb', enrollments: 16 },
          { month: 'Mar', enrollments: 10 }
        ]
      },
      {
        courseId: 'course3',
        courseTitle: 'Data Science Fundamentals',
        totalEnrollments: 32,
        activeEnrollments: 20,
        completedEnrollments: 12,
        averageProgress: 65.8,
        averageGrade: 'B',
        revenue: 15999.68,
        enrollmentTrend: [
          { month: 'Jan', enrollments: 10 },
          { month: 'Feb', enrollments: 14 },
          { month: 'Mar', enrollments: 8 }
        ]
      }
    ];
  }

  getMockStudentEnrollmentHistory(): StudentEnrollmentHistory {
    return {
      studentId: 'student1',
      studentName: 'John Doe',
      enrollments: this.getMockEnrollments().filter(e => e.studentId === 'student1'),
      totalCourses: 3,
      completedCourses: 1,
      averageGrade: 'B+',
      totalSpent: 899.97,
      certificatesEarned: 1
    };
  }
} 