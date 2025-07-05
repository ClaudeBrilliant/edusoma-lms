import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CourseAnalytics {
  courseId: string;
  courseTitle: string;
  totalEnrollments: number;
  completionRate: number;
  averageRating: number;
  totalRevenue: number;
  activeStudents: number;
}

export interface StudentAnalytics {
  studentId: string;
  studentName: string;
  totalCourses: number;
  completedCourses: number;
  averageScore: number;
  lastActive: Date;
  certificatesEarned: number;
}

export interface RevenueAnalytics {
  period: string;
  revenue: number;
  enrollments: number;
  growth: number;
}

export interface EngagementAnalytics {
  date: string;
  activeUsers: number;
  courseViews: number;
  timeSpent: number; // in minutes
  quizAttempts: number;
}

export interface DashboardAnalytics {
  totalRevenue: number;
  totalStudents: number;
  totalCourses: number;
  averageCompletionRate: number;
  monthlyGrowth: number;
  topPerformingCourses: CourseAnalytics[];
  recentActivity: EngagementAnalytics[];
  revenueTrend: RevenueAnalytics[];
}

export interface QuizAnalytics {
  quizId: string;
  quizTitle: string;
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  questionAnalytics: QuestionAnalytics[];
}

export interface QuestionAnalytics {
  questionId: string;
  questionText: string;
  correctAnswers: number;
  totalAttempts: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Dashboard Analytics
  getDashboardAnalytics(): Observable<DashboardAnalytics> {
    return this.http.get<DashboardAnalytics>(`${this.apiUrl}/analytics/dashboard`);
  }

  // Course Analytics
  getCourseAnalytics(courseId?: string): Observable<CourseAnalytics[]> {
    const url = courseId 
      ? `${this.apiUrl}/analytics/courses/${courseId}`
      : `${this.apiUrl}/analytics/courses`;
    return this.http.get<CourseAnalytics[]>(url);
  }

  // Student Analytics
  getStudentAnalytics(studentId?: string): Observable<StudentAnalytics[]> {
    const url = studentId 
      ? `${this.apiUrl}/analytics/students/${studentId}`
      : `${this.apiUrl}/analytics/students`;
    return this.http.get<StudentAnalytics[]>(url);
  }

  // Revenue Analytics
  getRevenueAnalytics(period: string = 'monthly'): Observable<RevenueAnalytics[]> {
    return this.http.get<RevenueAnalytics[]>(`${this.apiUrl}/analytics/revenue?period=${period}`);
  }

  // Engagement Analytics
  getEngagementAnalytics(days: number = 30): Observable<EngagementAnalytics[]> {
    return this.http.get<EngagementAnalytics[]>(`${this.apiUrl}/analytics/engagement?days=${days}`);
  }

  // Quiz Analytics
  getQuizAnalytics(quizId?: string): Observable<QuizAnalytics[]> {
    const url = quizId 
      ? `${this.apiUrl}/analytics/quizzes/${quizId}`
      : `${this.apiUrl}/analytics/quizzes`;
    return this.http.get<QuizAnalytics[]>(url);
  }

  // Mock data for development
  getMockDashboardAnalytics(): DashboardAnalytics {
    return {
      totalRevenue: 45600,
      totalStudents: 1247,
      totalCourses: 23,
      averageCompletionRate: 78.5,
      monthlyGrowth: 12.3,
      topPerformingCourses: [
        {
          courseId: '1',
          courseTitle: 'Introduction to Web Development',
          totalEnrollments: 156,
          completionRate: 85.2,
          averageRating: 4.7,
          totalRevenue: 12480,
          activeStudents: 142
        },
        {
          courseId: '2',
          courseTitle: 'Advanced React Development',
          totalEnrollments: 89,
          completionRate: 72.1,
          averageRating: 4.8,
          totalRevenue: 8900,
          activeStudents: 67
        },
        {
          courseId: '3',
          courseTitle: 'Data Science Fundamentals',
          totalEnrollments: 134,
          completionRate: 81.3,
          averageRating: 4.6,
          totalRevenue: 10720,
          activeStudents: 118
        }
      ],
      recentActivity: [
        {
          date: '2024-01-15',
          activeUsers: 234,
          courseViews: 567,
          timeSpent: 45,
          quizAttempts: 89
        },
        {
          date: '2024-01-14',
          activeUsers: 198,
          courseViews: 432,
          timeSpent: 38,
          quizAttempts: 67
        },
        {
          date: '2024-01-13',
          activeUsers: 267,
          courseViews: 623,
          timeSpent: 52,
          quizAttempts: 94
        }
      ],
      revenueTrend: [
        {
          period: 'Jan 2024',
          revenue: 15600,
          enrollments: 234,
          growth: 15.2
        },
        {
          period: 'Dec 2023',
          revenue: 13500,
          enrollments: 198,
          growth: 8.7
        },
        {
          period: 'Nov 2023',
          revenue: 12400,
          enrollments: 187,
          growth: 12.1
        }
      ]
    };
  }

  getMockCourseAnalytics(): CourseAnalytics[] {
    return [
      {
        courseId: '1',
        courseTitle: 'Introduction to Web Development',
        totalEnrollments: 156,
        completionRate: 85.2,
        averageRating: 4.7,
        totalRevenue: 12480,
        activeStudents: 142
      },
      {
        courseId: '2',
        courseTitle: 'Advanced React Development',
        totalEnrollments: 89,
        completionRate: 72.1,
        averageRating: 4.8,
        totalRevenue: 8900,
        activeStudents: 67
      },
      {
        courseId: '3',
        courseTitle: 'Data Science Fundamentals',
        totalEnrollments: 134,
        completionRate: 81.3,
        averageRating: 4.6,
        totalRevenue: 10720,
        activeStudents: 118
      },
      {
        courseId: '4',
        courseTitle: 'Python for Beginners',
        totalEnrollments: 203,
        completionRate: 78.9,
        averageRating: 4.5,
        totalRevenue: 16240,
        activeStudents: 178
      },
      {
        courseId: '5',
        courseTitle: 'Machine Learning Basics',
        totalEnrollments: 67,
        completionRate: 65.4,
        averageRating: 4.9,
        totalRevenue: 5360,
        activeStudents: 45
      }
    ];
  }

  getMockEngagementAnalytics(): EngagementAnalytics[] {
    return [
      { date: '2024-01-15', activeUsers: 234, courseViews: 567, timeSpent: 45, quizAttempts: 89 },
      { date: '2024-01-14', activeUsers: 198, courseViews: 432, timeSpent: 38, quizAttempts: 67 },
      { date: '2024-01-13', activeUsers: 267, courseViews: 623, timeSpent: 52, quizAttempts: 94 },
      { date: '2024-01-12', activeUsers: 189, courseViews: 445, timeSpent: 41, quizAttempts: 73 },
      { date: '2024-01-11', activeUsers: 312, courseViews: 678, timeSpent: 58, quizAttempts: 102 },
      { date: '2024-01-10', activeUsers: 245, courseViews: 534, timeSpent: 47, quizAttempts: 81 },
      { date: '2024-01-09', activeUsers: 178, courseViews: 389, timeSpent: 35, quizAttempts: 59 }
    ];
  }
} 