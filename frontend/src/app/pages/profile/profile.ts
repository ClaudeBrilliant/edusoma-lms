import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {
  // Mock user data
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    role: 'student',
    joinDate: new Date('2024-01-15'),
    bio: 'Passionate learner and technology enthusiast.',
    location: 'New York, NY',
    website: 'https://johndoe.com',
    phone: '+1 (555) 123-4567'
  };

  constructor() {}
} 