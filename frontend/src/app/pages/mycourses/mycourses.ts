import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course, CourseEnrollment } from '../../services/courses.service';

@Component({
  selector: 'app-mycourses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './mycourses.html',
  styleUrl: './mycourses.css'
})
export class Mycourses implements OnInit {
  enrolledCourses: Course[] = [];
  enrollments: CourseEnrollment[] = [];
  loading = true;
  selectedTab = 'all-courses';
  searchTerm = '';
  selectedStatus = 'all';
  selectedProgress = 'all';

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadMyCourses();
  }

  loadMyCourses(): void {
    // Using mock data for development
    this.enrollments = this.coursesService.getMockEnrollments();
    this.enrolledCourses = this.coursesService.getMockCourses().filter(course => 
      this.enrollments.some(enrollment => 
        enrollment.courseId === course.id && enrollment.status === 'APPROVED'
      )
    );
    this.loading = false;
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  getFilteredCourses(): Course[] {
    let filtered = this.enrolledCourses;

    if (this.searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(course => {
        const enrollment = this.getEnrollmentByCourseId(course.id);
        return enrollment?.status === this.selectedStatus;
      });
    }

    if (this.selectedProgress !== 'all') {
      filtered = filtered.filter(course => {
        const enrollment = this.getEnrollmentByCourseId(course.id);
        if (!enrollment) return false;
        
        switch (this.selectedProgress) {
          case 'not-started':
            return enrollment.progress === 0;
          case 'in-progress':
            return enrollment.progress > 0 && enrollment.progress < 100;
          case 'completed':
            return enrollment.progress === 100;
          default:
            return true;
        }
      });
    }

    return filtered;
  }

  getEnrollmentByCourseId(courseId: string): CourseEnrollment | undefined {
    return this.enrollments.find(enrollment => enrollment.courseId === courseId);
  }

  getInProgressCourses(): Course[] {
    return this.enrolledCourses.filter(course => {
      const enrollment = this.getEnrollmentByCourseId(course.id);
      return enrollment && enrollment.progress > 0 && enrollment.progress < 100;
    });
  }

  getCompletedCourses(): Course[] {
    return this.enrolledCourses.filter(course => {
      const enrollment = this.getEnrollmentByCourseId(course.id);
      return enrollment && enrollment.progress === 100;
    });
  }

  getNotStartedCourses(): Course[] {
    return this.enrolledCourses.filter(course => {
      const enrollment = this.getEnrollmentByCourseId(course.id);
      return enrollment && enrollment.progress === 0;
    });
  }

  getFavoriteCourses(): Course[] {
    return this.enrolledCourses.filter(course => {
      const enrollment = this.getEnrollmentByCourseId(course.id);
      return enrollment && enrollment.isFavorite;
    });
  }

  getRecentCourses(): Course[] {
    return this.enrolledCourses
      .sort((a, b) => {
        const enrollmentA = this.getEnrollmentByCourseId(a.id);
        const enrollmentB = this.getEnrollmentByCourseId(b.id);
        if (!enrollmentA || !enrollmentB) return 0;
        return new Date(enrollmentB.lastAccessedAt).getTime() - new Date(enrollmentA.lastAccessedAt).getTime();
      })
      .slice(0, 6);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'text-green-500 bg-green-100';
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-500 bg-red-100';
      case 'WAITLISTED':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'fas fa-check-circle';
      case 'PENDING':
        return 'fas fa-clock';
      case 'REJECTED':
        return 'fas fa-ban';
      case 'WAITLISTED':
        return 'fas fa-hourglass-half';
      default:
        return 'fas fa-question-circle';
    }
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'BEGINNER':
        return 'text-green-500 bg-green-100';
      case 'INTERMEDIATE':
        return 'text-blue-500 bg-blue-100';
      case 'ADVANCED':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  getProgressBarColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  getProgressLabel(progress: number): string {
    if (progress === 0) return 'Not Started';
    if (progress === 100) return 'Completed';
    return 'In Progress';
  }

  getTimeRemaining(course: Course): string {
    const enrollment = this.getEnrollmentByCourseId(course.id);
    if (!enrollment || enrollment.progress === 100) return 'Completed';
    
    const totalMinutes = course.duration * 60;
    const completedMinutes = (totalMinutes * enrollment.progress) / 100;
    const remainingMinutes = totalMinutes - completedMinutes;
    
    if (remainingMinutes < 60) {
      return `${Math.ceil(remainingMinutes)} minutes left`;
    } else if (remainingMinutes < 1440) {
      return `${Math.ceil(remainingMinutes / 60)} hours left`;
    } else {
      return `${Math.ceil(remainingMinutes / 1440)} days left`;
    }
  }

  getNextClass(course: Course): string {
    // Mock data - in real app, this would come from the backend
    const nextClasses = [
      'Introduction to Variables',
      'Control Structures',
      'Functions and Methods',
      'Object-Oriented Programming',
      'Data Structures',
      'Final Project'
    ];
    
    const enrollment = this.getEnrollmentByCourseId(course.id);
    if (!enrollment) return 'No upcoming classes';
    
    const progressIndex = Math.floor((enrollment.progress / 100) * nextClasses.length);
    return nextClasses[progressIndex] || 'Course completed';
  }

  getDaysSinceEnrollment(course: Course): number {
    const enrollment = this.getEnrollmentByCourseId(course.id);
    if (!enrollment) return 0;
    
    const now = new Date();
    const enrollmentDate = new Date(enrollment.enrollmentDate);
    const diffTime = now.getTime() - enrollmentDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getStudyStreak(course: Course): number {
    // Mock data - in real app, this would be calculated from actual study sessions
    const enrollment = this.getEnrollmentByCourseId(course.id);
    if (!enrollment) return 0;
    
    // Random streak between 1-7 days for demo
    return Math.floor(Math.random() * 7) + 1;
  }

  continueCourse(course: Course): void {
    // TODO: Navigate to course content
    console.log('Continuing course:', course.id);
  }

  viewCourse(course: Course): void {
    // TODO: Navigate to course details
    console.log('Viewing course:', course.id);
  }

  markAsFavorite(course: Course): void {
    const enrollment = this.getEnrollmentByCourseId(course.id);
    if (enrollment) {
      enrollment.isFavorite = !enrollment.isFavorite;
      // TODO: Update in backend
      console.log('Toggling favorite for course:', course.id);
    }
  }

  downloadCertificate(course: Course): void {
    const enrollment = this.getEnrollmentByCourseId(course.id);
    if (enrollment && enrollment.certificateEarned) {
      // TODO: Download certificate
      console.log('Downloading certificate for course:', course.id);
    }
  }

  getTotalProgress(): number {
    if (this.enrolledCourses.length === 0) return 0;
    const totalProgress = this.enrolledCourses.reduce((sum, course) => {
      const enrollment = this.getEnrollmentByCourseId(course.id);
      return sum + (enrollment?.progress || 0);
    }, 0);
    return Math.round(totalProgress / this.enrolledCourses.length);
  }

  getTotalCourses(): number {
    return this.enrolledCourses.length;
  }

  getCompletedCoursesCount(): number {
    return this.getCompletedCourses().length;
  }

  getInProgressCoursesCount(): number {
    return this.getInProgressCourses().length;
  }

  getTotalStudyTime(): number {
    return this.enrolledCourses.reduce((total, course) => {
      const enrollment = this.getEnrollmentByCourseId(course.id);
      return total + (enrollment?.totalStudyTime || 0);
    }, 0);
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
}
