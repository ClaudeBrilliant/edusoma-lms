import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatar: string;
  isVerified: boolean;
  isActive: boolean;
  lastLogin: Date;
  joinDate: Date;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SocialLoginRequest {
  provider: 'google' | 'facebook' | 'github';
  token: string;
}

export interface SessionInfo {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  expiresAt: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);

  // Mock users for development
  private mockUsers: User[] = [
    {
      id: 'student-1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'demo@example.com',
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      isVerified: true,
      isActive: true,
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      joinDate: new Date('2024-01-15'),
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/New_York',
        emailNotifications: true,
        pushNotifications: true
      }
    },
    {
      id: 'instructor-1',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      role: 'INSTRUCTOR',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      isVerified: true,
      isActive: true,
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      joinDate: new Date('2023-11-20'),
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/Los_Angeles',
        emailNotifications: true,
        pushNotifications: true
      }
    },
    {
      id: 'admin-1',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      isVerified: true,
      isActive: true,
      lastLogin: new Date(Date.now() - 15 * 60 * 1000),
      joinDate: new Date('2023-06-01'),
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'America/Seattle',
        emailNotifications: true,
        pushNotifications: true
      }
    }
  ];

  constructor() {
    this.initializeAuth();
  }

  // Observable streams
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  get token$(): Observable<string | null> {
    return this.tokenSubject.asObservable();
  }

  // Current values
  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

  // Get token method for interceptors
  getToken(): string | null {
    return this.tokenSubject.value;
  }

  // Initialize authentication state
  private initializeAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();
    
    if (token && user && !this.isTokenExpired(token)) {
      this.setAuthState(user, token);
    } else {
      this.clearAuthState();
    }
  }

  // Login
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const user = this.mockUsers.find(u => u.email === credentials.email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Simulate password validation (in real app, this would be server-side)
    if (credentials.email === 'demo@example.com' && credentials.password === 'password') {
      const token = this.generateToken(user);
      const refreshToken = this.generateRefreshToken();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      const response: AuthResponse = {
        user,
        token,
        refreshToken,
        expiresAt
      };

      return of(response).pipe(
        delay(800),
        tap(response => {
          this.setAuthState(response.user, response.token);
          if (credentials.rememberMe) {
            this.storeAuthData(response);
          }
        })
      );
    } else {
      throw new Error('Invalid email or password');
    }
  }

  // Register
  register(data: RegisterData): Observable<AuthResponse> {
    // Check if user already exists
    const existingUser = this.mockUsers.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error('An account with this email already exists');
    }

    // Validate password match
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'STUDENT', // Default role
      avatar: this.generateAvatar(data.firstName, data.lastName),
      isVerified: false,
      isActive: true,
      lastLogin: new Date(),
      joinDate: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        emailNotifications: true,
        pushNotifications: true
      }
    };

    // Add to mock users
    this.mockUsers.push(newUser);

    const token = this.generateToken(newUser);
    const refreshToken = this.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const response: AuthResponse = {
      user: newUser,
      token,
      refreshToken,
      expiresAt
    };

    return of(response).pipe(
      delay(1000),
      tap(response => {
        this.setAuthState(response.user, response.token);
        this.storeAuthData(response);
      })
    );
  }

  // Logout
  logout(): Observable<void> {
    return of(void 0).pipe(
      delay(300),
      tap(() => {
        this.clearAuthState();
        this.clearStoredAuthData();
      })
    );
  }

  // Refresh token
  refreshToken(): Observable<AuthResponse> {
    const currentUser = this.currentUser;
    const currentToken = this.token;

    if (!currentUser || !currentToken) {
      throw new Error('No active session');
    }

    const newToken = this.generateToken(currentUser);
    const refreshToken = this.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const response: AuthResponse = {
      user: currentUser,
      token: newToken,
      refreshToken,
      expiresAt
    };

    return of(response).pipe(
      delay(500),
      tap(response => {
        this.setAuthState(response.user, response.token);
        this.storeAuthData(response);
      })
    );
  }

  // Password reset request
  requestPasswordReset(request: PasswordResetRequest): Observable<void> {
    const user = this.mockUsers.find(u => u.email === request.email);
    
    if (!user) {
      // Don't reveal if email exists or not for security
      return of(void 0).pipe(delay(800));
    }

    // Simulate sending reset email
    return of(void 0).pipe(delay(800));
  }

  // Confirm password reset
  confirmPasswordReset(confirm: PasswordResetConfirm): Observable<void> {
    // Simulate token validation and password update
    return of(void 0).pipe(delay(800));
  }

  // Change password
  changePassword(request: ChangePasswordRequest): Observable<void> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    if (request.newPassword !== request.confirmPassword) {
      throw new Error('New passwords do not match');
    }

    // Simulate password change
    return of(void 0).pipe(delay(600));
  }

  // Social login
  socialLogin(request: SocialLoginRequest): Observable<AuthResponse> {
    // Simulate social login
    const user = this.mockUsers[0]; // Use first mock user for demo
    const token = this.generateToken(user);
    const refreshToken = this.generateRefreshToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const response: AuthResponse = {
      user,
      token,
      refreshToken,
      expiresAt
    };

    return of(response).pipe(
      delay(1000),
      tap(response => {
        this.setAuthState(response.user, response.token);
        this.storeAuthData(response);
      })
    );
  }

  // Verify email
  verifyEmail(token: string): Observable<void> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    // Simulate email verification
    const currentUser = this.currentUser;
    if (currentUser) {
      currentUser.isVerified = true;
      this.currentUserSubject.next(currentUser);
    }

    return of(void 0).pipe(delay(600));
  }

  // Update user profile
  updateProfile(updates: Partial<User>): Observable<User> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('No current user');
    }

    const updatedUser = { ...currentUser, ...updates };
    this.currentUserSubject.next(updatedUser);

    // Update in mock users
    const userIndex = this.mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = updatedUser;
    }

    return of(updatedUser).pipe(delay(500));
  }

  // Update user preferences
  updatePreferences(preferences: Partial<UserPreferences>): Observable<User> {
    if (!this.isAuthenticated) {
      throw new Error('User not authenticated');
    }

    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('No current user');
    }

    const updatedUser = {
      ...currentUser,
      preferences: { ...currentUser.preferences, ...preferences }
    };

    this.currentUserSubject.next(updatedUser);

    // Update in mock users
    const userIndex = this.mockUsers.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      this.mockUsers[userIndex] = updatedUser;
    }

    return of(updatedUser).pipe(delay(400));
  }

  // Check if user has role
  hasRole(role: string): boolean {
    return this.currentUser?.role === role;
  }

  // Check if user has any of the roles
  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.currentUser?.role || '');
  }

  // Get session info
  getSessionInfo(): SessionInfo {
    return {
      isAuthenticated: this.isAuthenticated,
      user: this.currentUser,
      token: this.token,
      expiresAt: this.getTokenExpiration()
    };
  }

  // Private methods
  private setAuthState(user: User, token: string): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    this.tokenSubject.next(token);
  }

  private clearAuthState(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.tokenSubject.next(null);
  }

  private generateToken(user: User): string {
    // In real app, this would be a JWT token from the server
    return `mock-jwt-token-${user.id}-${Date.now()}`;
  }

  private generateRefreshToken(): string {
    return `mock-refresh-token-${Date.now()}`;
  }

  private generateAvatar(firstName: string, lastName: string): string {
    // Generate avatar URL based on name
    const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    return `https://ui-avatars.com/api/?name=${initials}&background=3b82f6&color=fff&size=40`;
  }

  private isTokenExpired(token: string): boolean {
    // In real app, this would decode the JWT and check expiration
    return false; // Mock implementation
  }

  private getTokenExpiration(): Date | null {
    // In real app, this would decode the JWT and get expiration
    return new Date(Date.now() + 24 * 60 * 60 * 1000); // Mock implementation
  }

  // Local storage methods
  private storeAuthData(response: AuthResponse): void {
    localStorage.setItem('auth_token', response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    localStorage.setItem('auth_expires', response.expiresAt.toISOString());
  }

  private getStoredToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem('auth_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  private clearStoredAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_expires');
  }
} 