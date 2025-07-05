import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InstructorService, Course, Analytics } from '../../services/instructor.service';

@Component({
  selector: 'app-instructor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './instructor-dashboard.html',
  styleUrl: './instructor-dashboard.css'
})
export class InstructorDashboard implements OnInit {
  courses: Course[] = [];
  analytics: Analytics | null = null;
  loading = true;
  selectedTab = 'overview';

  constructor(private instructorService: InstructorService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    // For now, using mock data. Replace with actual API calls when backend is ready
    this.courses = this.instructorService.getMockCourses();
    this.analytics = this.instructorService.getMockAnalytics();
    this.loading = false;
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'BEGINNER':
        return 'bg-green-500';
      case 'INTERMEDIATE':
        return 'bg-yellow-500';
      case 'ADVANCED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  }

  getDifficultyText(difficulty: string): string {
    switch (difficulty) {
      case 'BEGINNER':
        return 'Beginner';
      case 'INTERMEDIATE':
        return 'Intermediate';
      case 'ADVANCED':
        return 'Advanced';
      default:
        return difficulty;
    }
  }

  createNewCourse(): void {
    // TODO: Implement course creation modal/form
    console.log('Create new course clicked');
  }

  scheduleClass(): void {
    // TODO: Implement class scheduling modal/form
    console.log('Schedule class clicked');
  }

  editCourse(courseId: string): void {
    // TODO: Navigate to course edit page
    console.log('Edit course:', courseId);
  }

  viewCourse(courseId: string): void {
    // TODO: Navigate to course view page
    console.log('View course:', courseId);
  }

  getRecentEnrollments(): number {
    return this.analytics?.recentEnrollments || 0;
  }

  getTotalStudents(): number {
    return this.analytics?.totalStudents || 0;
  }

  getAverageRating(): number {
    return this.analytics?.averageRating || 0;
  }
}
