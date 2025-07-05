import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course, CourseCategory } from '../../services/courses.service';
import { Navbar } from '../navbar/navbar';
import { Footer } from "../footer/footer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  courses: Course[] = [];
  categories: CourseCategory[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = 'all';
  selectedLevel = 'all';
  priceRange = { min: 0, max: 1000 };
  selectedRating = 0;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadCoursesData();
  }

  loadCoursesData(): void {
    // Using mock data for development
    this.courses = this.coursesService.getMockCourses();
    this.categories = this.coursesService.getMockCategories();
    this.loading = false;
  }

  getPublishedCourses(): Course[] {
    return this.courses.filter(course => course.status === 'PUBLISHED');
  }

  getFilteredCourses(): Course[] {
    let filtered = this.getPublishedCourses();

    if (this.searchTerm) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.instructorName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        course.tags.some(tag => tag.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }

    if (this.selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }

    if (this.selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === this.selectedLevel);
    }

    if (this.selectedRating > 0) {
      filtered = filtered.filter(course => course.rating >= this.selectedRating);
    }

    filtered = filtered.filter(course => 
      course.price >= this.priceRange.min && course.price <= this.priceRange.max
    );

    return filtered;
  }

  getFeaturedCourses(): Course[] {
    return this.getPublishedCourses().filter(course => course.isFeatured);
  }

  getPopularCourses(): Course[] {
    return this.getPublishedCourses().filter(course => course.isPopular);
  }

  getNewCourses(): Course[] {
    return this.getPublishedCourses().filter(course => course.isNew);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'text-green-500 bg-green-100';
      case 'DRAFT':
        return 'text-gray-500 bg-gray-100';
      case 'PENDING_APPROVAL':
        return 'text-yellow-500 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-500 bg-red-100';
      case 'ARCHIVED':
        return 'text-purple-500 bg-purple-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PUBLISHED':
        return 'fas fa-check-circle';
      case 'DRAFT':
        return 'fas fa-edit';
      case 'PENDING_APPROVAL':
        return 'fas fa-clock';
      case 'REJECTED':
        return 'fas fa-ban';
      case 'ARCHIVED':
        return 'fas fa-archive';
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

  getDiscountPrice(course: Course): number | null {
    if (course.discountPercentage && course.originalPrice) {
      return course.originalPrice * (1 - course.discountPercentage / 100);
    }
    return null;
  }

  hasDiscount(course: Course): boolean {
    return course.discountPercentage !== undefined && course.discountPercentage > 0;
  }

  getDaysUntilDeadline(course: Course): number | null {
    if (!course.enrollmentDeadline) return null;
    const now = new Date();
    const deadline = new Date(course.enrollmentDeadline);
    const diffTime = deadline.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  isEnrollmentOpen(course: Course): boolean {
    if (!course.enrollmentDeadline) return true;
    return this.getDaysUntilDeadline(course)! > 0;
  }

  getEnrollmentStatus(course: Course): string {
    if (!course.maxStudents) return 'Open';
    if (course.currentEnrollments >= course.maxStudents) return 'Full';
    const percentage = (course.currentEnrollments / course.maxStudents) * 100;
    if (percentage >= 80) return 'Almost Full';
    return 'Open';
  }

  getEnrollmentStatusColor(course: Course): string {
    const status = this.getEnrollmentStatus(course);
    switch (status) {
      case 'Open':
        return 'text-green-500';
      case 'Almost Full':
        return 'text-yellow-500';
      case 'Full':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  }

  enrollInCourse(course: Course): void {
    // TODO: Implement course enrollment
    console.log('Enrolling in course:', course.id);
  }

  viewCourse(course: Course): void {
    // TODO: Navigate to course details
    console.log('Viewing course:', course.id);
  }
}
