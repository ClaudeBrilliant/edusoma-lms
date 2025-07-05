import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoursesService, Course, Module, Class, CourseEnrollment, CourseReview, CourseStats, CourseCategory, CourseFilter } from '../../services/courses.service';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './courses.html',
  styleUrl: './courses.css'
})
export class CoursesComponent implements OnInit {
  courses: Course[] = [];
  modules: Module[] = [];
  classes: Class[] = [];
  enrollments: CourseEnrollment[] = [];
  reviews: CourseReview[] = [];
  stats: CourseStats | null = null;
  categories: CourseCategory[] = [];
  loading = true;
  selectedTab = 'all-courses';
  selectedCourse: Course | null = null;
  selectedModule: Module | null = null;
  selectedClass: Class | null = null;
  selectedEnrollment: CourseEnrollment | null = null;
  isViewingCourse = false;
  isCreatingCourse = false;
  isEditingCourse = false;
  isViewingEnrollment = false;
  isProcessingEnrollment = false;
  searchTerm = '';
  selectedCategory = 'all';
  selectedLevel = 'all';
  selectedStatus = 'all';
  selectedInstructor = 'all';
  priceRange = { min: 0, max: 1000 };
  selectedRating = 0;
  rejectionReason = '';
  newCourse: Partial<Course> = {};
  newModule: Partial<Module> = {};
  newClass: Partial<Class> = {};
  newReview: Partial<CourseReview> = {};
  
  // Course form properties
  courseForm: any = {
    title: '',
    category: '',
    shortDescription: '',
    description: '',
    level: '',
    duration: 0,
    price: 0,
    thumbnail: ''
  };
  submitting = false;

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    this.loadCoursesData();
  }

  loadCoursesData(): void {
    // Using mock data for development
    this.courses = this.coursesService.getMockCourses();
    this.modules = this.coursesService.getMockModules();
    this.classes = this.coursesService.getMockClasses();
    this.enrollments = this.coursesService.getMockEnrollments();
    this.reviews = this.coursesService.getMockReviews();
    this.stats = this.coursesService.getMockCourseStats();
    this.categories = this.coursesService.getMockCategories();
    this.loading = false;
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
    this.resetForms();
  }

  resetForms(): void {
    this.isViewingCourse = false;
    this.isCreatingCourse = false;
    this.isEditingCourse = false;
    this.isViewingEnrollment = false;
    this.isProcessingEnrollment = false;
    this.selectedCourse = null;
    this.selectedModule = null;
    this.selectedClass = null;
    this.selectedEnrollment = null;
    this.rejectionReason = '';
    this.newCourse = {};
    this.newModule = {};
    this.newClass = {};
    this.newReview = {};
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

  getApprovalStatusColor(status: string): string {
    switch (status) {
      case 'APPROVED':
        return 'text-green-500 bg-green-100';
      case 'PENDING':
        return 'text-yellow-500 bg-yellow-100';
      case 'REJECTED':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }

  getEnrollmentStatusBadgeColor(status: string): string {
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

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  formatDurationHours(hours: number): string {
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }
    return `${hours}h`;
  }

  viewCourse(course: Course): void {
    this.selectedCourse = course;
    this.isViewingCourse = true;
  }

  createCourse(): void {
    this.isCreatingCourse = true;
  }

  editCourse(course: Course): void {
    this.selectedCourse = course;
    this.newCourse = { ...course };
    this.isEditingCourse = true;
  }

  saveCourse(): void {
    if (this.isCreatingCourse) {
      // TODO: Implement course creation
      console.log('Creating course:', this.newCourse);
    } else if (this.isEditingCourse) {
      // TODO: Implement course update
      console.log('Updating course:', this.newCourse);
    }
    this.resetForms();
  }

  deleteCourse(course: Course): void {
    if (confirm(`Are you sure you want to delete "${course.title}"?`)) {
      // TODO: Implement course deletion
      console.log('Deleting course:', course.id);
    }
  }

  publishCourse(course: Course): void {
    if (confirm(`Publish "${course.title}"?`)) {
      // TODO: Implement course publishing
      console.log('Publishing course:', course.id);
    }
  }

  archiveCourse(course: Course): void {
    if (confirm(`Archive "${course.title}"?`)) {
      // TODO: Implement course archiving
      console.log('Archiving course:', course.id);
    }
  }

  submitForApproval(course: Course): void {
    if (confirm(`Submit "${course.title}" for approval?`)) {
      // TODO: Implement approval submission
      console.log('Submitting course for approval:', course.id);
    }
  }

  approveCourse(course: Course): void {
    if (confirm(`Approve "${course.title}"?`)) {
      // TODO: Implement course approval
      console.log('Approving course:', course.id);
    }
  }

  rejectCourse(course: Course): void {
    if (this.rejectionReason.trim()) {
      // TODO: Implement course rejection
      console.log('Rejecting course:', course.id, 'Reason:', this.rejectionReason);
      this.resetForms();
    }
  }

  viewEnrollment(enrollment: CourseEnrollment): void {
    this.selectedEnrollment = enrollment;
    this.isViewingEnrollment = true;
  }

  approveEnrollment(enrollment: CourseEnrollment): void {
    // TODO: Implement enrollment approval
    console.log('Approving enrollment:', enrollment.id);
    this.isProcessingEnrollment = true;
  }

  rejectEnrollment(enrollment: CourseEnrollment): void {
    if (this.rejectionReason.trim()) {
      // TODO: Implement enrollment rejection
      console.log('Rejecting enrollment:', enrollment.id, 'Reason:', this.rejectionReason);
      this.isProcessingEnrollment = true;
    }
  }

  enrollInCourse(course: Course): void {
    // TODO: Implement course enrollment
    console.log('Enrolling in course:', course.id);
  }

  getFilteredCourses(): Course[] {
    let filtered = this.courses;

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

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(course => course.status === this.selectedStatus);
    }

    if (this.selectedInstructor !== 'all') {
      filtered = filtered.filter(course => course.instructorId === this.selectedInstructor);
    }

    if (this.selectedRating > 0) {
      filtered = filtered.filter(course => course.rating >= this.selectedRating);
    }

    filtered = filtered.filter(course => 
      course.price >= this.priceRange.min && course.price <= this.priceRange.max
    );

    return filtered;
  }

  getPublishedCourses(): Course[] {
    return this.courses.filter(course => course.status === 'PUBLISHED');
  }

  getDraftCourses(): Course[] {
    return this.courses.filter(course => course.status === 'DRAFT');
  }

  getCourseById(courseId: string): Course | undefined {
    return this.courses.find(course => course.id === courseId);
  }

  getPendingApprovalCourses(): Course[] {
    return this.courses.filter(course => course.status === 'PENDING_APPROVAL');
  }

  getFeaturedCourses(): Course[] {
    return this.courses.filter(course => course.isFeatured);
  }

  getPopularCourses(): Course[] {
    return this.courses.filter(course => course.isPopular);
  }

  getNewCourses(): Course[] {
    return this.courses.filter(course => course.isNew);
  }

  getCourseModules(courseId: string): Module[] {
    return this.modules.filter(module => module.courseId === courseId);
  }

  getModuleClasses(moduleId: string): Class[] {
    return this.classes.filter(cls => cls.moduleId === moduleId);
  }

  getCourseEnrollments(courseId: string): CourseEnrollment[] {
    return this.enrollments.filter(enrollment => enrollment.courseId === courseId);
  }

  getCourseReviews(courseId: string): CourseReview[] {
    return this.reviews.filter(review => review.courseId === courseId);
  }

  getPendingEnrollments(): CourseEnrollment[] {
    return this.enrollments.filter(enrollment => enrollment.status === 'PENDING');
  }

  getApprovedEnrollments(): CourseEnrollment[] {
    return this.enrollments.filter(enrollment => enrollment.status === 'APPROVED');
  }

  getRejectedEnrollments(): CourseEnrollment[] {
    return this.enrollments.filter(enrollment => enrollment.status === 'REJECTED');
  }

  getWaitlistedEnrollments(): CourseEnrollment[] {
    return this.enrollments.filter(enrollment => enrollment.status === 'WAITLISTED');
  }

  getAverageRating(courseId: string): number {
    const courseReviews = this.getCourseReviews(courseId);
    if (courseReviews.length === 0) return 0;
    const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0);
    return Math.round((totalRating / courseReviews.length) * 10) / 10;
  }

  getTotalRevenue(): number {
    return this.enrollments
      .filter(enrollment => enrollment.paymentStatus === 'PAID')
      .reduce((total, enrollment) => total + enrollment.amount, 0);
  }

  getTotalEnrollments(): number {
    return this.enrollments.length;
  }

  getCompletionRate(): number {
    const totalEnrollments = this.enrollments.length;
    const completedEnrollments = this.enrollments.filter(enrollment => enrollment.certificateEarned).length;
    return totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0;
  }

  getInstructors(): { id: string; name: string }[] {
    const instructorMap = new Map<string, string>();
    this.courses.forEach(course => {
      instructorMap.set(course.instructorId, course.instructorName);
    });
    return Array.from(instructorMap.entries()).map(([id, name]) => ({ id, name }));
  }

  getCategoryById(categoryId: string): CourseCategory | undefined {
    return this.categories.find(category => category.id === categoryId);
  }

  getCategoryColor(categoryId: string): string {
    const category = this.getCategoryById(categoryId);
    return category?.color || '#6b7280';
  }

  getCategoryIcon(categoryId: string): string {
    const category = this.getCategoryById(categoryId);
    return category?.icon || 'fas fa-folder';
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

  exportCourseData(): void {
    // TODO: Implement data export
    console.log('Exporting course data...');
  }

  bulkApproveCourses(): void {
    const pendingCourses = this.getPendingApprovalCourses();
    if (pendingCourses.length > 0) {
      const courseIds = pendingCourses.map(course => course.id);
      // TODO: Implement bulk approval
      console.log('Bulk approving courses:', courseIds);
    }
  }

  bulkRejectCourses(): void {
    const pendingCourses = this.getPendingApprovalCourses();
    if (pendingCourses.length > 0 && this.rejectionReason.trim()) {
      const courseIds = pendingCourses.map(course => course.id);
      // TODO: Implement bulk rejection
      console.log('Bulk rejecting courses:', courseIds, 'Reason:', this.rejectionReason);
    }
  }

  bulkApproveEnrollments(): void {
    const pendingEnrollments = this.getPendingEnrollments();
    if (pendingEnrollments.length > 0) {
      const enrollmentIds = pendingEnrollments.map(enrollment => enrollment.id);
      // TODO: Implement bulk approval
      console.log('Bulk approving enrollments:', enrollmentIds);
    }
  }

  bulkRejectEnrollments(): void {
    const pendingEnrollments = this.getPendingEnrollments();
    if (pendingEnrollments.length > 0 && this.rejectionReason.trim()) {
      const enrollmentIds = pendingEnrollments.map(enrollment => enrollment.id);
      // TODO: Implement bulk rejection
      console.log('Bulk rejecting enrollments:', enrollmentIds, 'Reason:', this.rejectionReason);
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

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 60) return 'text-blue-500';
    if (progress >= 40) return 'text-yellow-500';
    return 'text-red-500';
  }

  getProgressBarColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  onSubmitCourseForm(): void {
    this.submitting = true;
    // TODO: Implement course creation logic
    setTimeout(() => {
      this.submitting = false;
      this.isCreatingCourse = false;
      this.resetForms();
    }, 1000);
  }
}
