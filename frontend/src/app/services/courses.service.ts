import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Course {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number; // in hours
  price: number;
  currency: string;
  thumbnail: string;
  banner: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'PENDING_APPROVAL' | 'REJECTED';
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  targetAudience: string[];
  maxStudents?: number;
  currentEnrollments: number;
  rating: number;
  totalReviews: number;
  totalModules: number;
  totalClasses: number;
  totalAssignments: number;
  totalQuizzes: number;
  certificateIncluded: boolean;
  language: string;
  subtitles: string[];
  isFeatured: boolean;
  isPopular: boolean;
  isNew: boolean;
  discountPercentage?: number;
  originalPrice?: number;
  enrollmentDeadline?: Date;
  startDate?: Date;
  endDate?: Date;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number; // in minutes
  totalClasses: number;
  completedClasses: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Class {
  id: string;
  moduleId: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  type: 'VIDEO' | 'LIVE' | 'DOCUMENT' | 'QUIZ' | 'ASSIGNMENT';
  duration: number; // in minutes
  videoUrl?: string;
  documentUrl?: string;
  isFree: boolean;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  enrollmentDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'WAITLISTED';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  amount: number;
  currency: string;
  progress: number; // percentage
  lastActivityDate: Date;
  lastAccessedAt: Date;
  completedAt?: Date;
  certificateEarned: boolean;
  isFavorite: boolean;
  totalStudyTime: number; // in minutes
}

export interface CourseReview {
  id: string;
  courseId: string;
  studentId: string;
  studentName: string;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}

export interface CourseStats {
  totalCourses: number;
  publishedCourses: number;
  draftCourses: number;
  pendingApproval: number;
  totalEnrollments: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
  featuredCourses: number;
  popularCourses: number;
  newCourses: number;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
}

export interface CourseFilter {
  category?: string;
  level?: string;
  priceRange?: { min: number; max: number };
  rating?: number;
  status?: string;
  instructor?: string;
  tags?: string[];
  language?: string;
  duration?: { min: number; max: number };
}

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Course Management
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/courses/${id}`);
  }

  getCoursesByInstructor(instructorId: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/instructors/${instructorId}/courses`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/courses`, course);
  }

  updateCourse(id: string, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}`, course);
  }

  deleteCourse(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/courses/${id}`);
  }

  publishCourse(id: string): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}/publish`, {});
  }

  archiveCourse(id: string): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}/archive`, {});
  }

  // Course Approval
  submitForApproval(id: string): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}/submit-approval`, {});
  }

  approveCourse(id: string): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}/approve`, {});
  }

  rejectCourse(id: string, reason: string): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/courses/${id}/reject`, { reason });
  }

  // Module Management
  getModules(courseId: string): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.apiUrl}/courses/${courseId}/modules`);
  }

  getModuleById(id: string): Observable<Module> {
    return this.http.get<Module>(`${this.apiUrl}/modules/${id}`);
  }

  createModule(module: Partial<Module>): Observable<Module> {
    return this.http.post<Module>(`${this.apiUrl}/modules`, module);
  }

  updateModule(id: string, module: Partial<Module>): Observable<Module> {
    return this.http.put<Module>(`${this.apiUrl}/modules/${id}`, module);
  }

  deleteModule(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/modules/${id}`);
  }

  // Class Management
  getClasses(moduleId: string): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.apiUrl}/modules/${moduleId}/classes`);
  }

  getClassById(id: string): Observable<Class> {
    return this.http.get<Class>(`${this.apiUrl}/classes/${id}`);
  }

  createClass(classData: Partial<Class>): Observable<Class> {
    return this.http.post<Class>(`${this.apiUrl}/classes`, classData);
  }

  updateClass(id: string, classData: Partial<Class>): Observable<Class> {
    return this.http.put<Class>(`${this.apiUrl}/classes/${id}`, classData);
  }

  deleteClass(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/classes/${id}`);
  }

  // Enrollment Management
  getCourseEnrollments(courseId: string): Observable<CourseEnrollment[]> {
    return this.http.get<CourseEnrollment[]>(`${this.apiUrl}/courses/${courseId}/enrollments`);
  }

  enrollInCourse(enrollment: Partial<CourseEnrollment>): Observable<CourseEnrollment> {
    return this.http.post<CourseEnrollment>(`${this.apiUrl}/course-enrollments`, enrollment);
  }

  approveEnrollment(id: string): Observable<CourseEnrollment> {
    return this.http.put<CourseEnrollment>(`${this.apiUrl}/course-enrollments/${id}/approve`, {});
  }

  rejectEnrollment(id: string, reason: string): Observable<CourseEnrollment> {
    return this.http.put<CourseEnrollment>(`${this.apiUrl}/course-enrollments/${id}/reject`, { reason });
  }

  // Reviews
  getCourseReviews(courseId: string): Observable<CourseReview[]> {
    return this.http.get<CourseReview[]>(`${this.apiUrl}/courses/${courseId}/reviews`);
  }

  createReview(review: Partial<CourseReview>): Observable<CourseReview> {
    return this.http.post<CourseReview>(`${this.apiUrl}/reviews`, review);
  }

  updateReview(id: string, review: Partial<CourseReview>): Observable<CourseReview> {
    return this.http.put<CourseReview>(`${this.apiUrl}/reviews/${id}`, review);
  }

  deleteReview(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reviews/${id}`);
  }

  // Analytics
  getCourseStats(): Observable<CourseStats> {
    return this.http.get<CourseStats>(`${this.apiUrl}/courses/stats`);
  }

  getCategories(): Observable<CourseCategory[]> {
    return this.http.get<CourseCategory[]>(`${this.apiUrl}/course-categories`);
  }

  // Search and Filter
  searchCourses(query: string, filters?: CourseFilter): Observable<Course[]> {
    return this.http.post<Course[]>(`${this.apiUrl}/courses/search`, { query, filters });
  }

  // Mock data for development
  getMockCourses(): Course[] {
    return [
      {
        id: 'course1',
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript. This comprehensive course covers everything you need to know to build modern websites.',
        shortDescription: 'Master the fundamentals of web development with HTML, CSS, and JavaScript.',
        instructorId: 'instructor1',
        instructorName: 'Dr. Sarah Johnson',
        instructorEmail: 'sarah.johnson@edusoma.com',
        category: 'Web Development',
        level: 'BEGINNER',
        duration: 40,
        price: 299.99,
        currency: 'USD',
        thumbnail: '/assets/images/courses/web-dev-thumb.jpg',
        banner: '/assets/images/courses/web-dev-banner.jpg',
        status: 'PUBLISHED',
        approvalStatus: 'APPROVED',
        approvedBy: 'Admin User',
        approvedAt: new Date('2024-01-15'),
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-20'),
        publishedAt: new Date('2024-01-15'),
        tags: ['HTML', 'CSS', 'JavaScript', 'Web Development'],
        prerequisites: ['Basic computer skills', 'No prior programming experience required'],
        learningObjectives: [
          'Understand HTML structure and semantics',
          'Style websites with CSS',
          'Add interactivity with JavaScript',
          'Build responsive websites'
        ],
        targetAudience: ['Beginners', 'Students', 'Career changers'],
        maxStudents: 100,
        currentEnrollments: 45,
        rating: 4.8,
        totalReviews: 23,
        totalModules: 12,
        totalClasses: 48,
        totalAssignments: 8,
        totalQuizzes: 6,
        certificateIncluded: true,
        language: 'English',
        subtitles: ['Spanish', 'French'],
        isFeatured: true,
        isPopular: true,
        isNew: false,
        discountPercentage: 20,
        originalPrice: 374.99,
        enrollmentDeadline: new Date('2024-03-15'),
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-05-01')
      },
      {
        id: 'course2',
        title: 'Advanced React Development',
        description: 'Take your React skills to the next level with advanced patterns, state management, and performance optimization techniques.',
        shortDescription: 'Advanced React patterns, state management, and performance optimization.',
        instructorId: 'instructor2',
        instructorName: 'Prof. Michael Chen',
        instructorEmail: 'michael.chen@edusoma.com',
        category: 'Frontend Development',
        level: 'ADVANCED',
        duration: 60,
        price: 399.99,
        currency: 'USD',
        thumbnail: '/assets/images/courses/react-thumb.jpg',
        banner: '/assets/images/courses/react-banner.jpg',
        status: 'PUBLISHED',
        approvalStatus: 'APPROVED',
        approvedBy: 'Admin User',
        approvedAt: new Date('2024-01-12'),
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2024-01-18'),
        publishedAt: new Date('2024-01-12'),
        tags: ['React', 'JavaScript', 'Frontend', 'State Management'],
        prerequisites: ['Basic JavaScript knowledge', 'Understanding of React fundamentals'],
        learningObjectives: [
          'Master advanced React patterns',
          'Implement state management solutions',
          'Optimize React performance',
          'Build scalable applications'
        ],
        targetAudience: ['Intermediate developers', 'React developers'],
        maxStudents: 50,
        currentEnrollments: 38,
        rating: 4.9,
        totalReviews: 31,
        totalModules: 15,
        totalClasses: 60,
        totalAssignments: 10,
        totalQuizzes: 8,
        certificateIncluded: true,
        language: 'English',
        subtitles: ['Spanish'],
        isFeatured: true,
        isPopular: true,
        isNew: false,
        startDate: new Date('2024-02-15'),
        endDate: new Date('2024-06-15')
      },
      {
        id: 'course3',
        title: 'Data Science Fundamentals',
        description: 'Introduction to data science concepts, tools, and methodologies for analyzing and interpreting data.',
        shortDescription: 'Learn data science fundamentals and analytical techniques.',
        instructorId: 'instructor3',
        instructorName: 'Dr. Emily Davis',
        instructorEmail: 'emily.davis@edusoma.com',
        category: 'Data Science',
        level: 'INTERMEDIATE',
        duration: 80,
        price: 499.99,
        currency: 'USD',
        thumbnail: '/assets/images/courses/data-science-thumb.jpg',
        banner: '/assets/images/courses/data-science-banner.jpg',
        status: 'PUBLISHED',
        approvalStatus: 'APPROVED',
        approvedBy: 'Admin User',
        approvedAt: new Date('2024-01-08'),
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-16'),
        publishedAt: new Date('2024-01-08'),
        tags: ['Data Science', 'Python', 'Machine Learning', 'Analytics'],
        prerequisites: ['Basic Python knowledge', 'Understanding of statistics'],
        learningObjectives: [
          'Understand data science workflow',
          'Master Python for data analysis',
          'Apply statistical methods',
          'Build predictive models'
        ],
        targetAudience: ['Analysts', 'Researchers', 'Students'],
        maxStudents: 75,
        currentEnrollments: 32,
        rating: 4.7,
        totalReviews: 18,
        totalModules: 18,
        totalClasses: 72,
        totalAssignments: 12,
        totalQuizzes: 10,
        certificateIncluded: true,
        language: 'English',
        subtitles: ['Spanish', 'Portuguese'],
        isFeatured: false,
        isPopular: true,
        isNew: true,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-07-01')
      },
      {
        id: 'course4',
        title: 'Mobile App Development with Flutter',
        description: 'Build cross-platform mobile applications using Flutter framework and Dart programming language.',
        shortDescription: 'Create beautiful mobile apps with Flutter and Dart.',
        instructorId: 'instructor4',
        instructorName: 'Alex Rodriguez',
        instructorEmail: 'alex.rodriguez@edusoma.com',
        category: 'Mobile Development',
        level: 'INTERMEDIATE',
        duration: 50,
        price: 349.99,
        currency: 'USD',
        thumbnail: '/assets/images/courses/flutter-thumb.jpg',
        banner: '/assets/images/courses/flutter-banner.jpg',
        status: 'DRAFT',
        approvalStatus: 'PENDING',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        tags: ['Flutter', 'Dart', 'Mobile Development', 'Cross-platform'],
        prerequisites: ['Basic programming knowledge', 'Understanding of OOP'],
        learningObjectives: [
          'Master Flutter framework',
          'Build cross-platform apps',
          'Implement state management',
          'Deploy to app stores'
        ],
        targetAudience: ['Mobile developers', 'Web developers'],
        currentEnrollments: 0,
        rating: 0,
        totalReviews: 0,
        totalModules: 0,
        totalClasses: 0,
        totalAssignments: 0,
        totalQuizzes: 0,
        certificateIncluded: true,
        language: 'English',
        subtitles: [],
        isFeatured: false,
        isPopular: false,
        isNew: true
      },
      {
        id: 'course5',
        title: 'Cybersecurity Essentials',
        description: 'Learn the fundamentals of cybersecurity, threat detection, and security best practices.',
        shortDescription: 'Essential cybersecurity concepts and practices.',
        instructorId: 'instructor5',
        instructorName: 'Lisa Thompson',
        instructorEmail: 'lisa.thompson@edusoma.com',
        category: 'Cybersecurity',
        level: 'BEGINNER',
        duration: 35,
        price: 249.99,
        currency: 'USD',
        thumbnail: '/assets/images/courses/cybersecurity-thumb.jpg',
        banner: '/assets/images/courses/cybersecurity-banner.jpg',
        status: 'PENDING_APPROVAL',
        approvalStatus: 'PENDING',
        createdAt: new Date('2024-01-28'),
        updatedAt: new Date('2024-01-28'),
        tags: ['Cybersecurity', 'Security', 'Networking', 'Threat Detection'],
        prerequisites: ['Basic computer knowledge'],
        learningObjectives: [
          'Understand cybersecurity threats',
          'Implement security measures',
          'Detect and respond to attacks',
          'Follow security best practices'
        ],
        targetAudience: ['IT professionals', 'Students', 'Business owners'],
        currentEnrollments: 0,
        rating: 0,
        totalReviews: 0,
        totalModules: 0,
        totalClasses: 0,
        totalAssignments: 0,
        totalQuizzes: 0,
        certificateIncluded: true,
        language: 'English',
        subtitles: [],
        isFeatured: false,
        isPopular: false,
        isNew: true
      }
    ];
  }

  getMockModules(): Module[] {
    return [
      {
        id: 'module1',
        courseId: 'course1',
        title: 'Introduction to HTML',
        description: 'Learn the basics of HTML markup and document structure.',
        order: 1,
        duration: 120,
        totalClasses: 4,
        completedClasses: 0,
        isCompleted: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 'module2',
        courseId: 'course1',
        title: 'CSS Styling',
        description: 'Master CSS for styling and layout of web pages.',
        order: 2,
        duration: 180,
        totalClasses: 6,
        completedClasses: 0,
        isCompleted: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 'module3',
        courseId: 'course1',
        title: 'JavaScript Basics',
        description: 'Introduction to JavaScript programming and DOM manipulation.',
        order: 3,
        duration: 240,
        totalClasses: 8,
        completedClasses: 0,
        isCompleted: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ];
  }

  getMockClasses(): Class[] {
    return [
      {
        id: 'class1',
        moduleId: 'module1',
        courseId: 'course1',
        title: 'HTML Document Structure',
        description: 'Learn about HTML document structure and basic elements.',
        order: 1,
        type: 'VIDEO',
        duration: 30,
        videoUrl: 'https://example.com/video1.mp4',
        isFree: true,
        isCompleted: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      },
      {
        id: 'class2',
        moduleId: 'module1',
        courseId: 'course1',
        title: 'HTML Elements and Tags',
        description: 'Understanding HTML elements, tags, and attributes.',
        order: 2,
        type: 'VIDEO',
        duration: 45,
        videoUrl: 'https://example.com/video2.mp4',
        isFree: false,
        isCompleted: false,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-10')
      }
    ];
  }

  getMockEnrollments(): CourseEnrollment[] {
    return [
      {
        id: 'enrollment1',
        courseId: 'course1',
        studentId: 'student1',
        studentName: 'John Doe',
        studentEmail: 'john.doe@email.com',
        enrollmentDate: new Date('2024-01-15'),
        status: 'APPROVED',
        approvedBy: 'Dr. Sarah Johnson',
        approvedAt: new Date('2024-01-16'),
        paymentStatus: 'PAID',
        amount: 299.99,
        currency: 'USD',
        progress: 25,
        lastActivityDate: new Date('2024-01-28'),
        lastAccessedAt: new Date('2024-01-28'),
        certificateEarned: false,
        isFavorite: true,
        totalStudyTime: 180
      },
      {
        id: 'enrollment2',
        courseId: 'course1',
        studentId: 'student2',
        studentName: 'Jane Smith',
        studentEmail: 'jane.smith@email.com',
        enrollmentDate: new Date('2024-01-20'),
        status: 'PENDING',
        paymentStatus: 'PENDING',
        amount: 299.99,
        currency: 'USD',
        progress: 0,
        lastActivityDate: new Date('2024-01-20'),
        lastAccessedAt: new Date('2024-01-20'),
        certificateEarned: false,
        isFavorite: false,
        totalStudyTime: 0
      }
    ];
  }

  getMockReviews(): CourseReview[] {
    return [
      {
        id: 'review1',
        courseId: 'course1',
        studentId: 'student1',
        studentName: 'John Doe',
        rating: 5,
        review: 'Excellent course! The instructor explains concepts clearly and the practical exercises are very helpful.',
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        isVerified: true
      },
      {
        id: 'review2',
        courseId: 'course1',
        studentId: 'student3',
        studentName: 'Bob Wilson',
        rating: 4,
        review: 'Great course for beginners. The pace is perfect and the content is well-structured.',
        createdAt: new Date('2024-01-26'),
        updatedAt: new Date('2024-01-26'),
        isVerified: true
      }
    ];
  }

  getMockCourseStats(): CourseStats {
    return {
      totalCourses: 15,
      publishedCourses: 12,
      draftCourses: 2,
      pendingApproval: 1,
      totalEnrollments: 156,
      totalRevenue: 45678.90,
      averageRating: 4.6,
      totalReviews: 89,
      featuredCourses: 5,
      popularCourses: 8,
      newCourses: 3
    };
  }

  getMockCategories(): CourseCategory[] {
    return [
      {
        id: 'cat1',
        name: 'Web Development',
        description: 'Learn to build modern websites and web applications',
        icon: 'fas fa-globe',
        color: '#3b82f6',
        courseCount: 5
      },
      {
        id: 'cat2',
        name: 'Mobile Development',
        description: 'Create mobile applications for iOS and Android',
        icon: 'fas fa-mobile-alt',
        color: '#10b981',
        courseCount: 3
      },
      {
        id: 'cat3',
        name: 'Data Science',
        description: 'Master data analysis and machine learning',
        icon: 'fas fa-chart-bar',
        color: '#f59e0b',
        courseCount: 4
      },
      {
        id: 'cat4',
        name: 'Cybersecurity',
        description: 'Learn to protect systems and networks',
        icon: 'fas fa-shield-alt',
        color: '#ef4444',
        courseCount: 2
      }
    ];
  }
} 