import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalRevenue: number;
  activeUsers: number;
  pendingApprovals: number;
  totalEnrollments: number;
  monthlyGrowth: number;
  platformHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface CourseManagement {
  id: string;
  title: string;
  instructor: string;
  instructorId: string;
  category: string;
  level: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_REVIEW' | 'REJECTED';
  enrollments: number;
  rating: number;
  price: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  lastReviewedAt?: Date;
  reviewNotes?: string;
  featured: boolean;
  certificateEligible: boolean;
  totalClasses: number;
  duration: number;
  thumbnail: string;
  shortDescription: string;
  tags: string[];
}

export interface UserManagement {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';
  joinDate: Date;
  lastLogin: Date;
  totalEnrollments?: number;
  totalCourses?: number;
  totalRevenue?: number;
  isVerified: boolean;
  avatar: string;
  preferences: any;
}

export interface PlatformAnalytics {
  userGrowth: {
    period: string;
    newUsers: number;
    activeUsers: number;
    totalUsers: number;
  }[];
  revenueData: {
    period: string;
    revenue: number;
    enrollments: number;
    averageOrderValue: number;
  }[];
  coursePerformance: {
    category: string;
    enrollments: number;
    revenue: number;
    averageRating: number;
  }[];
  topCourses: {
    id: string;
    title: string;
    instructor: string;
    enrollments: number;
    revenue: number;
    rating: number;
  }[];
  topInstructors: {
    id: string;
    name: string;
    courses: number;
    students: number;
    revenue: number;
    rating: number;
  }[];
}

export interface SystemHealth {
  serverStatus: 'online' | 'offline' | 'maintenance';
  databaseStatus: 'healthy' | 'warning' | 'critical';
  storageUsage: number;
  memoryUsage: number;
  cpuUsage: number;
  activeConnections: number;
  lastBackup: Date;
  uptime: number;
  errors: {
    timestamp: Date;
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    component: string;
  }[];
}

export interface ApprovalRequest {
  id: string;
  type: 'COURSE' | 'INSTRUCTOR' | 'CONTENT' | 'CERTIFICATE';
  title: string;
  description: string;
  requester: string;
  requesterId: string;
  submittedAt: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  reviewedAt?: Date;
  reviewNotes?: string;
}

export interface AdminNotification {
  id: string;
  type: 'SYSTEM' | 'USER' | 'COURSE' | 'PAYMENT' | 'SECURITY';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: Date;
  actionRequired: boolean;
  actionUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {
  private statsSubject = new BehaviorSubject<AdminStats | null>(null);
  private coursesSubject = new BehaviorSubject<CourseManagement[]>([]);
  private usersSubject = new BehaviorSubject<UserManagement[]>([]);
  private analyticsSubject = new BehaviorSubject<PlatformAnalytics | null>(null);
  private systemHealthSubject = new BehaviorSubject<SystemHealth | null>(null);
  private approvalsSubject = new BehaviorSubject<ApprovalRequest[]>([]);
  private notificationsSubject = new BehaviorSubject<AdminNotification[]>([]);

  constructor() {
    this.initializeMockData();
  }

  // Observable streams
  get stats$(): Observable<AdminStats | null> {
    return this.statsSubject.asObservable();
  }

  get courses$(): Observable<CourseManagement[]> {
    return this.coursesSubject.asObservable();
  }

  get users$(): Observable<UserManagement[]> {
    return this.usersSubject.asObservable();
  }

  get analytics$(): Observable<PlatformAnalytics | null> {
    return this.analyticsSubject.asObservable();
  }

  get systemHealth$(): Observable<SystemHealth | null> {
    return this.systemHealthSubject.asObservable();
  }

  get approvals$(): Observable<ApprovalRequest[]> {
    return this.approvalsSubject.asObservable();
  }

  get notifications$(): Observable<AdminNotification[]> {
    return this.notificationsSubject.asObservable();
  }

  // Load dashboard data
  loadDashboardData(): Observable<{
    stats: AdminStats;
    courses: CourseManagement[];
    users: UserManagement[];
    analytics: PlatformAnalytics;
    systemHealth: SystemHealth;
    approvals: ApprovalRequest[];
    notifications: AdminNotification[];
  }> {
    const data = {
      stats: this.getMockStats(),
      courses: this.getMockCourses(),
      users: this.getMockUsers(),
      analytics: this.getMockAnalytics(),
      systemHealth: this.getMockSystemHealth(),
      approvals: this.getMockApprovals(),
      notifications: this.getMockNotifications()
    };

    return of(data).pipe(
      delay(800),
      tap(data => {
        this.statsSubject.next(data.stats);
        this.coursesSubject.next(data.courses);
        this.usersSubject.next(data.users);
        this.analyticsSubject.next(data.analytics);
        this.systemHealthSubject.next(data.systemHealth);
        this.approvalsSubject.next(data.approvals);
        this.notificationsSubject.next(data.notifications);
      })
    );
  }

  // Course Management
  getCourses(filters?: any): Observable<CourseManagement[]> {
    let courses = this.getMockCourses();
    
    if (filters) {
      if (filters.status) {
        courses = courses.filter(course => course.status === filters.status);
      }
      if (filters.category) {
        courses = courses.filter(course => course.category === filters.category);
      }
      if (filters.search) {
        courses = courses.filter(course => 
          course.title.toLowerCase().includes(filters.search.toLowerCase()) ||
          course.instructor.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
    }

    return of(courses).pipe(delay(300));
  }

  updateCourseStatus(courseId: string, status: CourseManagement['status'], notes?: string): Observable<CourseManagement> {
    const courses = this.coursesSubject.value;
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex !== -1) {
      courses[courseIndex].status = status;
      courses[courseIndex].reviewNotes = notes;
      courses[courseIndex].lastReviewedAt = new Date();
      this.coursesSubject.next([...courses]);
    }

    return of(courses[courseIndex]).pipe(delay(500));
  }

  toggleCourseFeatured(courseId: string): Observable<CourseManagement> {
    const courses = this.coursesSubject.value;
    const courseIndex = courses.findIndex(c => c.id === courseId);
    
    if (courseIndex !== -1) {
      courses[courseIndex].featured = !courses[courseIndex].featured;
      this.coursesSubject.next([...courses]);
    }

    return of(courses[courseIndex]).pipe(delay(300));
  }

  deleteCourse(courseId: string): Observable<void> {
    const courses = this.coursesSubject.value.filter(c => c.id !== courseId);
    this.coursesSubject.next(courses);
    return of(void 0).pipe(delay(500));
  }

  // User Management
  getUsers(filters?: any): Observable<UserManagement[]> {
    let users = this.getMockUsers();
    
    if (filters) {
      if (filters.role) {
        users = users.filter(user => user.role === filters.role);
      }
      if (filters.status) {
        users = users.filter(user => user.status === filters.status);
      }
      if (filters.search) {
        users = users.filter(user => 
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(filters.search.toLowerCase()) ||
          user.email.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
    }

    return of(users).pipe(delay(300));
  }

  updateUserStatus(userId: string, status: UserManagement['status']): Observable<UserManagement> {
    const users = this.usersSubject.value;
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
      users[userIndex].status = status;
      this.usersSubject.next([...users]);
    }

    return of(users[userIndex]).pipe(delay(500));
  }

  deleteUser(userId: string): Observable<void> {
    const users = this.usersSubject.value.filter(u => u.id !== userId);
    this.usersSubject.next(users);
    return of(void 0).pipe(delay(500));
  }

  // Analytics
  getAnalytics(period: string = 'month'): Observable<PlatformAnalytics> {
    return of(this.getMockAnalytics()).pipe(delay(400));
  }

  // System Health
  getSystemHealth(): Observable<SystemHealth> {
    return of(this.getMockSystemHealth()).pipe(delay(200));
  }

  // Approvals
  getApprovals(): Observable<ApprovalRequest[]> {
    return of(this.getMockApprovals()).pipe(delay(300));
  }

  approveRequest(requestId: string, notes?: string): Observable<ApprovalRequest> {
    const approvals = this.approvalsSubject.value;
    const approvalIndex = approvals.findIndex(a => a.id === requestId);
    
    if (approvalIndex !== -1) {
      approvals[approvalIndex].status = 'APPROVED';
      approvals[approvalIndex].reviewNotes = notes;
      approvals[approvalIndex].reviewedAt = new Date();
      this.approvalsSubject.next([...approvals]);
    }

    return of(approvals[approvalIndex]).pipe(delay(500));
  }

  rejectRequest(requestId: string, notes: string): Observable<ApprovalRequest> {
    const approvals = this.approvalsSubject.value;
    const approvalIndex = approvals.findIndex(a => a.id === requestId);
    
    if (approvalIndex !== -1) {
      approvals[approvalIndex].status = 'REJECTED';
      approvals[approvalIndex].reviewNotes = notes;
      approvals[approvalIndex].reviewedAt = new Date();
      this.approvalsSubject.next([...approvals]);
    }

    return of(approvals[approvalIndex]).pipe(delay(500));
  }

  // Notifications
  getNotifications(): Observable<AdminNotification[]> {
    return of(this.getMockNotifications()).pipe(delay(200));
  }

  markNotificationAsRead(notificationId: string): Observable<void> {
    const notifications = this.notificationsSubject.value;
    const notificationIndex = notifications.findIndex(n => n.id === notificationId);
    
    if (notificationIndex !== -1) {
      notifications[notificationIndex].isRead = true;
      this.notificationsSubject.next([...notifications]);
    }

    return of(void 0).pipe(delay(200));
  }

  // Mock data methods
  private initializeMockData(): void {
    // Initialize with mock data
  }

  private getMockStats(): AdminStats {
    return {
      totalUsers: 15420,
      totalCourses: 847,
      totalRevenue: 1250000,
      activeUsers: 8920,
      pendingApprovals: 23,
      totalEnrollments: 45678,
      monthlyGrowth: 12.5,
      platformHealth: 'excellent'
    };
  }

  private getMockCourses(): CourseManagement[] {
    return [
      {
        id: 'course-1',
        title: 'Complete Web Development Bootcamp',
        instructor: 'Sarah Johnson',
        instructorId: 'instructor-1',
        category: 'Web Development',
        level: 'BEGINNER',
        status: 'PUBLISHED',
        enrollments: 1247,
        rating: 4.8,
        price: 89.99,
        currency: 'USD',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20'),
        featured: true,
        certificateEligible: true,
        totalClasses: 45,
        duration: 32,
        thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop',
        shortDescription: 'Learn web development from scratch to advanced concepts',
        tags: ['HTML', 'CSS', 'JavaScript', 'React']
      },
      {
        id: 'course-2',
        title: 'Advanced Python Programming',
        instructor: 'David Wilson',
        instructorId: 'instructor-2',
        category: 'Programming',
        level: 'ADVANCED',
        status: 'PENDING_REVIEW',
        enrollments: 892,
        rating: 4.9,
        price: 129.99,
        currency: 'USD',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-25'),
        featured: false,
        certificateEligible: true,
        totalClasses: 38,
        duration: 28,
        thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=300&h=200&fit=crop',
        shortDescription: 'Master advanced Python concepts and best practices',
        tags: ['Python', 'Django', 'Flask', 'Data Science']
      },
      {
        id: 'course-3',
        title: 'Digital Marketing Masterclass',
        instructor: 'Emily Chen',
        instructorId: 'instructor-3',
        category: 'Marketing',
        level: 'INTERMEDIATE',
        status: 'PUBLISHED',
        enrollments: 2156,
        rating: 4.7,
        price: 69.99,
        currency: 'USD',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-18'),
        featured: true,
        certificateEligible: true,
        totalClasses: 52,
        duration: 40,
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop',
        shortDescription: 'Comprehensive digital marketing strategies and tools',
        tags: ['SEO', 'Social Media', 'Google Ads', 'Analytics']
      }
    ];
  }

  private getMockUsers(): UserManagement[] {
    return [
      {
        id: 'user-1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'STUDENT',
        status: 'ACTIVE',
        joinDate: new Date('2024-01-15'),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        totalEnrollments: 12,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        preferences: {}
      },
      {
        id: 'instructor-1',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@example.com',
        role: 'INSTRUCTOR',
        status: 'ACTIVE',
        joinDate: new Date('2023-11-20'),
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
        totalCourses: 8,
        totalRevenue: 45000,
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        preferences: {}
      }
    ];
  }

  private getMockAnalytics(): PlatformAnalytics {
    return {
      userGrowth: [
        { period: 'Jan', newUsers: 1200, activeUsers: 8500, totalUsers: 12000 },
        { period: 'Feb', newUsers: 1400, activeUsers: 8900, totalUsers: 13400 },
        { period: 'Mar', newUsers: 1600, activeUsers: 9200, totalUsers: 15000 }
      ],
      revenueData: [
        { period: 'Jan', revenue: 85000, enrollments: 3200, averageOrderValue: 26.56 },
        { period: 'Feb', revenue: 92000, enrollments: 3500, averageOrderValue: 26.29 },
        { period: 'Mar', revenue: 98000, enrollments: 3800, averageOrderValue: 25.79 }
      ],
      coursePerformance: [
        { category: 'Web Development', enrollments: 8500, revenue: 320000, averageRating: 4.6 },
        { category: 'Programming', enrollments: 7200, revenue: 280000, averageRating: 4.7 },
        { category: 'Marketing', enrollments: 6800, revenue: 250000, averageRating: 4.5 }
      ],
      topCourses: [
        { id: 'course-1', title: 'Complete Web Development Bootcamp', instructor: 'Sarah Johnson', enrollments: 1247, revenue: 112000, rating: 4.8 },
        { id: 'course-2', title: 'Advanced Python Programming', instructor: 'David Wilson', enrollments: 892, revenue: 116000, rating: 4.9 },
        { id: 'course-3', title: 'Digital Marketing Masterclass', instructor: 'Emily Chen', enrollments: 2156, revenue: 151000, rating: 4.7 }
      ],
      topInstructors: [
        { id: 'instructor-1', name: 'Sarah Johnson', courses: 8, students: 4500, revenue: 45000, rating: 4.8 },
        { id: 'instructor-2', name: 'David Wilson', courses: 6, students: 3200, revenue: 38000, rating: 4.9 },
        { id: 'instructor-3', name: 'Emily Chen', courses: 5, students: 2800, revenue: 35000, rating: 4.7 }
      ]
    };
  }

  private getMockSystemHealth(): SystemHealth {
    return {
      serverStatus: 'online',
      databaseStatus: 'healthy',
      storageUsage: 65,
      memoryUsage: 72,
      cpuUsage: 45,
      activeConnections: 1250,
      lastBackup: new Date(Date.now() - 6 * 60 * 60 * 1000),
      uptime: 99.8,
      errors: [
        { timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), level: 'warning', message: 'High memory usage detected', component: 'Web Server' },
        { timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), level: 'info', message: 'Scheduled maintenance completed', component: 'Database' }
      ]
    };
  }

  private getMockApprovals(): ApprovalRequest[] {
    return [
      {
        id: 'approval-1',
        type: 'COURSE',
        title: 'Advanced Python Programming',
        description: 'New course submission for advanced Python concepts',
        requester: 'David Wilson',
        requesterId: 'instructor-2',
        submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'medium'
      },
      {
        id: 'approval-2',
        type: 'INSTRUCTOR',
        title: 'Instructor Application - Michael Brown',
        description: 'New instructor application for Data Science courses',
        requester: 'Michael Brown',
        requesterId: 'user-15',
        submittedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'PENDING',
        priority: 'high'
      }
    ];
  }

  private getMockNotifications(): AdminNotification[] {
    return [
      {
        id: 'notif-1',
        type: 'COURSE',
        title: 'New Course Submission',
        message: 'Advanced Python Programming course submitted for review',
        priority: 'medium',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        actionRequired: true,
        actionUrl: '/admin/approvals'
      },
      {
        id: 'notif-2',
        type: 'SYSTEM',
        title: 'System Maintenance',
        message: 'Scheduled maintenance completed successfully',
        priority: 'low',
        isRead: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        actionRequired: false
      }
    ];
  }
} 