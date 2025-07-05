import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  joinDate: Date;
  lastLogin: Date;
  avatar: string;
  totalCourses?: number;
  totalEnrollments?: number;
  totalRevenue?: number;
  isVerified: boolean;
  phone?: string;
  bio?: string;
  location?: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  suspendedUsers: number;
  students: number;
  instructors: number;
  admins: number;
  newUsersThisMonth: number;
  verifiedUsers: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private users: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinDate: new Date('2024-01-15'),
      lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      totalEnrollments: 8,
      isVerified: true,
      phone: '+1 (555) 123-4567',
      bio: 'Passionate learner interested in web development and design.',
      location: 'New York, NY'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      joinDate: new Date('2023-11-20'),
      lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      totalCourses: 15,
      totalRevenue: 12500,
      isVerified: true,
      phone: '+1 (555) 234-5678',
      bio: 'Experienced web developer and instructor with 10+ years of experience.',
      location: 'San Francisco, CA',
      website: 'https://sarahjohnson.dev',
      socialLinks: {
        twitter: '@sarahjohnson',
        linkedin: 'sarah-johnson-dev',
        github: 'sarahjohnson'
      }
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinDate: new Date('2024-02-10'),
      lastLogin: new Date(Date.now() - 5 * 60 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      totalEnrollments: 12,
      isVerified: false,
      phone: '+1 (555) 345-6789',
      bio: 'Computer science student learning full-stack development.',
      location: 'Boston, MA'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      email: 'emily.davis@example.com',
      role: 'INSTRUCTOR',
      status: 'ACTIVE',
      joinDate: new Date('2023-09-15'),
      lastLogin: new Date(Date.now() - 30 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      totalCourses: 8,
      totalRevenue: 8500,
      isVerified: true,
      phone: '+1 (555) 456-7890',
      bio: 'UX/UI designer and frontend developer passionate about creating beautiful user experiences.',
      location: 'Austin, TX',
      website: 'https://emilydavis.design',
      socialLinks: {
        twitter: '@emilydavis',
        linkedin: 'emily-davis-design'
      }
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Wilson',
      email: 'david.wilson@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      joinDate: new Date('2023-06-01'),
      lastLogin: new Date(Date.now() - 15 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
      isVerified: true,
      phone: '+1 (555) 567-8901',
      bio: 'Platform administrator and system architect.',
      location: 'Seattle, WA'
    },
    {
      id: '6',
      firstName: 'Lisa',
      lastName: 'Brown',
      email: 'lisa.brown@example.com',
      role: 'STUDENT',
      status: 'INACTIVE',
      joinDate: new Date('2024-01-05'),
      lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
      totalEnrollments: 3,
      isVerified: true,
      phone: '+1 (555) 678-9012',
      bio: 'Marketing professional learning digital skills.',
      location: 'Chicago, IL'
    }
  ];

  constructor() {}

  getUsers(filters?: UserFilters): Observable<User[]> {
    let filteredUsers = [...this.users];

    if (filters?.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm)
      );
    }

    if (filters?.role && filters.role !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.role === filters.role);
    }

    if (filters?.status && filters.status !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.status === filters.status);
    }

    // Simulate API delay
    return of(filteredUsers).pipe(delay(500));
  }

  getUserById(id: string): Observable<User | null> {
    const user = this.users.find(u => u.id === id);
    return of(user || null).pipe(delay(300));
  }

  createUser(userData: Omit<User, 'id' | 'joinDate' | 'lastLogin'>): Observable<User> {
    const newUser: User = {
      ...userData,
      id: (this.users.length + 1).toString(),
      joinDate: new Date(),
      lastLogin: new Date()
    };
    
    this.users.push(newUser);
    return of(newUser).pipe(delay(800));
  }

  updateUser(id: string, updates: Partial<User>): Observable<User | null> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return of(null).pipe(delay(300));
    }

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    return of(this.users[userIndex]).pipe(delay(600));
  }

  deleteUser(id: string): Observable<boolean> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex === -1) {
      return of(false).pipe(delay(300));
    }

    this.users.splice(userIndex, 1);
    return of(true).pipe(delay(500));
  }

  toggleUserStatus(id: string): Observable<User | null> {
    const user = this.users.find(u => u.id === id);
    if (!user) {
      return of(null).pipe(delay(300));
    }

    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    return this.updateUser(id, { status: newStatus as 'ACTIVE' | 'INACTIVE' });
  }

  suspendUser(id: string): Observable<User | null> {
    return this.updateUser(id, { status: 'SUSPENDED' });
  }

  verifyUser(id: string): Observable<User | null> {
    return this.updateUser(id, { isVerified: true });
  }

  getUserStats(): Observable<UserStats> {
    const stats: UserStats = {
      totalUsers: this.users.length,
      activeUsers: this.users.filter(u => u.status === 'ACTIVE').length,
      inactiveUsers: this.users.filter(u => u.status === 'INACTIVE').length,
      suspendedUsers: this.users.filter(u => u.status === 'SUSPENDED').length,
      students: this.users.filter(u => u.role === 'STUDENT').length,
      instructors: this.users.filter(u => u.role === 'INSTRUCTOR').length,
      admins: this.users.filter(u => u.role === 'ADMIN').length,
      newUsersThisMonth: this.users.filter(u => {
        const now = new Date();
        const userDate = new Date(u.joinDate);
        return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
      }).length,
      verifiedUsers: this.users.filter(u => u.isVerified).length
    };

    return of(stats).pipe(delay(400));
  }

  searchUsers(query: string): Observable<User[]> {
    const searchTerm = query.toLowerCase();
    const results = this.users.filter(user => 
      user.firstName.toLowerCase().includes(searchTerm) ||
      user.lastName.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm)
    );
    
    return of(results).pipe(delay(300));
  }

  getUsersByRole(role: string): Observable<User[]> {
    const filteredUsers = this.users.filter(user => user.role === role);
    return of(filteredUsers).pipe(delay(300));
  }

  getUsersByStatus(status: string): Observable<User[]> {
    const filteredUsers = this.users.filter(user => user.status === status);
    return of(filteredUsers).pipe(delay(300));
  }

  updateLastLogin(id: string): Observable<void> {
    const userIndex = this.users.findIndex(u => u.id === id);
    if (userIndex !== -1) {
      this.users[userIndex].lastLogin = new Date();
    }
    return of(void 0).pipe(delay(200));
  }

  bulkUpdateUsers(updates: { id: string; updates: Partial<User> }[]): Observable<User[]> {
    const updatedUsers: User[] = [];
    
    updates.forEach(({ id, updates: userUpdates }) => {
      const userIndex = this.users.findIndex(u => u.id === id);
      if (userIndex !== -1) {
        this.users[userIndex] = { ...this.users[userIndex], ...userUpdates };
        updatedUsers.push(this.users[userIndex]);
      }
    });

    return of(updatedUsers).pipe(delay(1000));
  }

  exportUsers(format: 'csv' | 'json'): Observable<string> {
    // Simulate export functionality
    const data = format === 'csv' 
      ? this.convertToCSV(this.users)
      : JSON.stringify(this.users, null, 2);
    
    return of(data).pipe(delay(1500));
  }

  private convertToCSV(users: User[]): string {
    const headers = ['ID', 'First Name', 'Last Name', 'Email', 'Role', 'Status', 'Join Date', 'Last Login', 'Verified'];
    const rows = users.map(user => [
      user.id,
      user.firstName,
      user.lastName,
      user.email,
      user.role,
      user.status,
      user.joinDate.toISOString(),
      user.lastLogin.toISOString(),
      user.isVerified ? 'Yes' : 'No'
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
} 