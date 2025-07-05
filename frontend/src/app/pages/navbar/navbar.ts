import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {
  isMenuOpen = false;
  isUserMenuOpen = false;
  isSearchOpen = false;
  searchQuery = '';
  currentRoute = '';

  // Mock user data - in real app, this would come from auth service
  currentUser = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    role: 'student',
    isAuthenticated: false // This would be set by auth service
  };

  // Navigation items for unauthenticated pages (home, about, contact, login, register)
  unauthenticatedNavigationItems = [
    { name: 'About', path: '/about', icon: 'fas fa-info-circle' },
    { name: 'Contact', path: '/contact', icon: 'fas fa-envelope' },
    { name: 'Courses', path: '/courses', icon: 'fas fa-book' },
    { name: 'Login', path: '/login', icon: 'fas fa-sign-in-alt' },
    { name: 'Register', path: '/register', icon: 'fas fa-user-plus' }
  ];

  // Navigation items for authenticated pages (dashboard, mycourses, etc.)
  authenticatedNavigationItems = [
    { name: 'Dashboard', path: '/student-dashboard', icon: 'fas fa-tachometer-alt' },
    { name: 'My Courses', path: '/mycourses', icon: 'fas fa-graduation-cap' },
    { name: 'Courses', path: '/courses', icon: 'fas fa-book' },
    { name: 'Instructors', path: '/instructors', icon: 'fas fa-chalkboard-teacher' },
    { name: 'About', path: '/about', icon: 'fas fa-info-circle' },
    { name: 'Contact', path: '/contact', icon: 'fas fa-envelope' }
  ];

  // Admin navigation items
  adminNavigationItems = [
    { name: 'Admin Dashboard', path: '/admin-dashboard', icon: 'fas fa-shield-alt' },
    { name: 'Users', path: '/users', icon: 'fas fa-users' },
    { name: 'Courses', path: '/courses', icon: 'fas fa-book' },
    { name: 'Analytics', path: '/analytics', icon: 'fas fa-chart-bar' },
    { name: 'About', path: '/about', icon: 'fas fa-info-circle' },
    { name: 'Contact', path: '/contact', icon: 'fas fa-envelope' }
  ];

  // Instructor navigation items
  instructorNavigationItems = [
    { name: 'Instructor Dashboard', path: '/instructor-dashboard', icon: 'fas fa-chalkboard-teacher' },
    { name: 'My Courses', path: '/mycourses', icon: 'fas fa-graduation-cap' },
    { name: 'Courses', path: '/courses', icon: 'fas fa-book' },
    { name: 'Analytics', path: '/analytics', icon: 'fas fa-chart-bar' },
    { name: 'About', path: '/about', icon: 'fas fa-info-circle' },
    { name: 'Contact', path: '/contact', icon: 'fas fa-envelope' }
  ];

  userMenuItems = [
    { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    { name: 'Settings', path: '/settings', icon: 'fas fa-cog' },
    { name: 'Help', path: '/help', icon: 'fas fa-question-circle' }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      this.closeMenus();
      this.updateAuthenticationStatus();
    });

    // Set initial route
    this.currentRoute = this.router.url;
    this.updateAuthenticationStatus();
  }

  updateAuthenticationStatus(): void {
    // Check if user is on authenticated pages
    const authenticatedRoutes = [
      '/student-dashboard',
      '/instructor-dashboard',
      '/admin-dashboard',
      '/mycourses',
      '/profile',
      '/messages',
      '/notifications',
      '/instructors'
    ];
    
    this.currentUser.isAuthenticated = authenticatedRoutes.some(route => 
      this.currentRoute.startsWith(route)
    );
  }

  get navigationItems() {
    if (!this.currentUser.isAuthenticated) {
      return this.unauthenticatedNavigationItems;
    }
    
    // Return role-based navigation
    switch (this.currentUser.role) {
      case 'admin':
        return this.adminNavigationItems;
      case 'instructor':
        return this.instructorNavigationItems;
      default:
        return this.authenticatedNavigationItems;
    }
  }

  isAuthenticatedPage(): boolean {
    return this.currentUser.isAuthenticated;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }

  toggleSearch(): void {
    this.isSearchOpen = !this.isSearchOpen;
    if (!this.isSearchOpen) {
      this.searchQuery = '';
    }
  }

  closeMenus(): void {
    this.isMenuOpen = false;
    this.isUserMenuOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
      this.searchQuery = '';
      this.isSearchOpen = false;
    }
  }

  logout(): void {
    // TODO: Implement logout functionality
    console.log('Logging out...');
    this.currentUser.isAuthenticated = false;
    this.router.navigate(['/']);
  }

  getNotificationCount(): number {
    // Mock notification count
    return 3;
  }

  getCartItemCount(): number {
    // Mock cart item count
    return 2;
  }

  // Method to simulate successful login
  simulateLogin(): void {
    this.currentUser.isAuthenticated = true;
    this.router.navigate(['/student-dashboard']);
  }

  // Methods to switch roles for testing
  switchToAdmin(): void {
    this.currentUser.role = 'admin';
    this.currentUser.isAuthenticated = true;
    this.router.navigate(['/admin-dashboard']);
  }

  switchToInstructor(): void {
    this.currentUser.role = 'instructor';
    this.currentUser.isAuthenticated = true;
    this.router.navigate(['/instructor-dashboard']);
  }

  switchToStudent(): void {
    this.currentUser.role = 'student';
    this.currentUser.isAuthenticated = true;
    this.router.navigate(['/student-dashboard']);
  }
}
