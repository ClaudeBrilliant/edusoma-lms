import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsService, DashboardAnalytics, CourseAnalytics, EngagementAnalytics } from '../../services/analytics.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.html',
  styleUrl: './analytics.css'
})
export class Analytics implements OnInit {
  dashboardData: DashboardAnalytics | null = null;
  courseAnalytics: CourseAnalytics[] = [];
  engagementData: EngagementAnalytics[] = [];
  loading = true;
  selectedTab = 'dashboard';
  selectedPeriod = '30';

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.loadAnalyticsData();
  }

  loadAnalyticsData(): void {
    this.loading = true;

    // Load dashboard analytics
    this.analyticsService.getDashboardAnalytics().subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard analytics:', error);
        this.loading = false;
      }
    });

    // Load course analytics
    this.analyticsService.getCourseAnalytics().subscribe({
      next: (data) => {
        this.courseAnalytics = data;
      },
      error: (error) => {
        console.error('Error loading course analytics:', error);
      }
    });

    // Load engagement analytics
    this.analyticsService.getEngagementAnalytics().subscribe({
      next: (data) => {
        this.engagementData = data;
      },
      error: (error) => {
        console.error('Error loading engagement analytics:', error);
      }
    });
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  changePeriod(period: string): void {
    this.selectedPeriod = period;
    // TODO: Reload data based on selected period
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatPercentage(value: number): string {
    return `${value.toFixed(1)}%`;
  }

  getGrowthColor(growth: number): string {
    return growth >= 0 ? 'text-green-500' : 'text-red-500';
  }

  getGrowthIcon(growth: number): string {
    return growth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
  }

  getCompletionRateColor(rate: number): string {
    if (rate >= 80) return 'text-green-500';
    if (rate >= 60) return 'text-yellow-500';
    return 'text-red-500';
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('fas fa-star');
    }
    if (hasHalfStar) {
      stars.push('fas fa-star-half-alt');
    }
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push('far fa-star');
    }
    return stars;
  }

  getTopPerformingCourses(): CourseAnalytics[] {
    return this.courseAnalytics
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 5);
  }

  getRecentActivity(): EngagementAnalytics[] {
    return this.engagementData.slice(0, 7);
  }

  getRevenueTrend(): any[] {
    return this.dashboardData?.revenueTrend || [];
  }

  // Helper methods to safely access engagement data
  getDailyActiveUsers(): number {
    return this.engagementData.length > 0 ? this.engagementData[0].activeUsers : 0;
  }

  getDailyCourseViews(): number {
    return this.engagementData.length > 0 ? this.engagementData[0].courseViews : 0;
  }

  getAverageSessionTime(): number {
    return this.engagementData.length > 0 ? this.engagementData[0].timeSpent : 0;
  }
}
