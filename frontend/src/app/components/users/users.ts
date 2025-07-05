import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface User {
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
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  loading = true;
  selectedRole = 'all';
  selectedStatus = 'all';
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  Math = Math; // Make Math available in template

  constructor() {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    // Mock data - in real app, this would come from a service
    this.users = [
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
        isVerified: true
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
        isVerified: true
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
        isVerified: false
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
        isVerified: true
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
        isVerified: true
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
        isVerified: true
      }
    ];

    this.filteredUsers = [...this.users];
    this.calculateTotalPages();
    this.loading = false;
  }

  filterUsers(): void {
    let filtered = [...this.users];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (this.selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === this.selectedRole);
    }

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === this.selectedStatus);
    }

    this.filteredUsers = filtered;
    this.currentPage = 1;
    this.calculateTotalPages();
  }

  calculateTotalPages(): void {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  getPaginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, endIndex);
  }

  onSearch(): void {
    this.filterUsers();
  }

  onRoleChange(): void {
    this.filterUsers();
  }

  onStatusChange(): void {
    this.filterUsers();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  getRoleColor(role: string): string {
    switch (role) {
      case 'ADMIN': return 'text-red-500 bg-red-100';
      case 'INSTRUCTOR': return 'text-blue-500 bg-blue-100';
      case 'STUDENT': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'text-green-500 bg-green-100';
      case 'INACTIVE': return 'text-yellow-500 bg-yellow-100';
      case 'SUSPENDED': return 'text-red-500 bg-red-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIVE': return 'fas fa-check-circle';
      case 'INACTIVE': return 'fas fa-clock';
      case 'SUSPENDED': return 'fas fa-ban';
      default: return 'fas fa-question-circle';
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

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  viewUser(user: User): void {
    console.log('Viewing user:', user.id);
    // TODO: Navigate to user details page
  }

  editUser(user: User): void {
    console.log('Editing user:', user.id);
    // TODO: Navigate to user edit page
  }

  deleteUser(user: User): void {
    console.log('Deleting user:', user.id);
    // TODO: Show confirmation dialog and delete user
  }

  toggleUserStatus(user: User): void {
    console.log('Toggling status for user:', user.id);
    // TODO: Toggle user status
  }

  getTotalUsers(): number {
    return this.users.length;
  }

  getActiveUsers(): number {
    return this.users.filter(user => user.status === 'ACTIVE').length;
  }

  getInactiveUsers(): number {
    return this.users.filter(user => user.status === 'INACTIVE').length;
  }

  getSuspendedUsers(): number {
    return this.users.filter(user => user.status === 'SUSPENDED').length;
  }

  getStudents(): number {
    return this.users.filter(user => user.role === 'STUDENT').length;
  }

  getInstructors(): number {
    return this.users.filter(user => user.role === 'INSTRUCTOR').length;
  }

  getAdmins(): number {
    return this.users.filter(user => user.role === 'ADMIN').length;
  }
}
