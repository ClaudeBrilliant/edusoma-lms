import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course, CourseEnrollment } from '../../services/courses.service';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, Navbar],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {
  loading = true;
  selectedTab = 'overview';
  
  // Mock user data
  currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    role: 'student',
    joinDate: new Date('2024-01-15'),
    totalStudyTime: 1560, // minutes
    certificatesEarned: 3,
    currentStreak: 7
  };

  // Dashboard statistics
  stats = {
    totalCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    averageProgress: 0,
    totalStudyTime: 0,
    certificatesEarned: 0,
    currentStreak: 0
  };

  // Recent activities
  recentActivities = [
    {
      type: 'course_completed',
      title: 'Completed "Advanced JavaScript"',
      description: 'You earned a certificate for completing the course',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      icon: 'fas fa-certificate',
      color: 'text-green-500'
    },
    {
      type: 'assignment_submitted',
      title: 'Submitted Assignment',
      description: 'React Fundamentals - Project 3 submitted',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
      icon: 'fas fa-file-alt',
      color: 'text-blue-500'
    },
    {
      type: 'course_enrolled',
      title: 'Enrolled in New Course',
      description: 'You enrolled in "Data Science Fundamentals"',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      icon: 'fas fa-graduation-cap',
      color: 'text-purple-500'
    },
    {
      type: 'achievement_unlocked',
      title: 'Achievement Unlocked',
      description: 'First Week Streak - 7 days of consistent learning',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      icon: 'fas fa-trophy',
      color: 'text-yellow-500'
    }
  ];

  // Upcoming assignments
  upcomingAssignments = [
    {
      id: '1',
      title: 'React State Management',
      course: 'React Fundamentals',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
      status: 'pending',
      priority: 'high'
    },
    {
      id: '2',
      title: 'JavaScript ES6 Features',
      course: 'Advanced JavaScript',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'in_progress',
      priority: 'medium'
    },
    {
      id: '3',
      title: 'Database Design Project',
      course: 'Database Management',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      status: 'not_started',
      priority: 'low'
    }
  ];

  // Recommended courses
  recommendedCourses: Course[] = [];

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // Load user's enrolled courses
    const enrollments = this.coursesService.getMockEnrollments();
    const allCourses = this.coursesService.getMockCourses();
    
    // Calculate statistics
    this.stats.totalCourses = enrollments.length;
    this.stats.completedCourses = enrollments.filter(e => e.progress === 100).length;
    this.stats.inProgressCourses = enrollments.filter(e => e.progress > 0 && e.progress < 100).length;
    this.stats.averageProgress = enrollments.length > 0 
      ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
      : 0;
    this.stats.totalStudyTime = enrollments.reduce((sum, e) => sum + (e.totalStudyTime || 0), 0);
    this.stats.certificatesEarned = enrollments.filter(e => e.certificateEarned).length;
    this.stats.currentStreak = this.currentUser.currentStreak;

    // Get recommended courses (courses not enrolled in)
    this.recommendedCourses = allCourses.filter(course => 
      !enrollments.some(enrollment => enrollment.courseId === course.id)
    ).slice(0, 3);

    this.loading = false;
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  getDaysUntilDue(dueDate: Date): number {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100';
      case 'medium': return 'text-yellow-500 bg-yellow-100';
      case 'low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'completed': return 'text-green-500 bg-green-100';
      case 'in_progress': return 'text-blue-500 bg-blue-100';
      case 'pending': return 'text-yellow-500 bg-yellow-100';
      case 'not_started': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  formatStudyTime(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else if (minutes < 1440) {
      return `${Math.round(minutes / 60)} hours`;
    } else {
      return `${Math.round(minutes / 1440)} days`;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else {
      return `${diffDays} days ago`;
    }
  }

  getStarRating(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push('fas fa-star text-yellow-400');
      } else if (i - 0.5 <= rating) {
        stars.push('fas fa-star-half-alt text-yellow-400');
      } else {
        stars.push('far fa-star text-gray-300');
      }
    }
    return stars;
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'BEGINNER': return 'text-green-500 bg-green-100';
      case 'INTERMEDIATE': return 'text-blue-500 bg-blue-100';
      case 'ADVANCED': return 'text-purple-500 bg-purple-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  formatCurrency(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  formatDurationHours(hours: number): string {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  }

  viewAssignment(assignment: any): void {
    console.log('Viewing assignment:', assignment.id);
    // TODO: Navigate to assignment details
  }

  startAssignment(assignment: any): void {
    console.log('Starting assignment:', assignment.id);
    // TODO: Navigate to assignment workspace
  }

  viewCourse(course: Course): void {
    console.log('Viewing course:', course.id);
    // TODO: Navigate to course details
  }

  enrollInCourse(course: Course): void {
    console.log('Enrolling in course:', course.id);
    // TODO: Implement enrollment logic
  }

  viewProfile(): void {
    console.log('Viewing profile');
    // TODO: Navigate to profile page
  }

  viewMessages(): void {
    console.log('Viewing messages');
    // TODO: Navigate to messages page
  }

  viewNotifications(): void {
    console.log('Viewing notifications');
    // TODO: Navigate to notifications page
  }
}
