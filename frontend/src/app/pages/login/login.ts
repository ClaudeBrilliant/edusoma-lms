import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  loginForm: LoginForm = {
    email: '',
    password: '',
    rememberMe: false
  };

  isSubmitting = false;
  showPassword = false;
  loginError = '';
  loginSuccess = false;

  // Form validation
  emailError = '';
  passwordError = '';

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.isSubmitting) return;

    // Reset errors
    this.loginError = '';
    this.emailError = '';
    this.passwordError = '';

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Mock authentication logic
      if (this.loginForm.email === 'demo@example.com' && this.loginForm.password === 'password') {
        this.loginSuccess = true;
        this.loginError = '';
        
        // Simulate redirect after successful login
        setTimeout(() => {
          // Redirect to student dashboard after successful login
          this.router.navigate(['/student-dashboard']);
        }, 1500);
      } else {
        this.loginError = 'Invalid email or password. Please try again.';
        this.loginSuccess = false;
      }
    }, 2000);
  }

  validateForm(): boolean {
    let isValid = true;

    // Email validation
    if (!this.loginForm.email) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.loginForm.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.loginForm.password) {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.loginForm.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      isValid = false;
    }

    return isValid;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  onEmailChange(): void {
    if (this.emailError) {
      this.emailError = '';
    }
  }

  onPasswordChange(): void {
    if (this.passwordError) {
      this.passwordError = '';
    }
  }

  loginWithGoogle(): void {
    console.log('Logging in with Google...');
    // Implement Google OAuth
  }

  loginWithFacebook(): void {
    console.log('Logging in with Facebook...');
    // Implement Facebook OAuth
  }

  loginWithGithub(): void {
    console.log('Logging in with GitHub...');
    // Implement GitHub OAuth
  }

  forgotPassword(): void {
    console.log('Forgot password clicked...');
    // Navigate to forgot password page
  }

  getPasswordInputType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  getPasswordIcon(): string {
    return this.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
  }

  getFormStatus(): string {
    if (this.loginSuccess) return 'success';
    if (this.loginError) return 'error';
    return 'default';
  }

  getStatusIcon(): string {
    switch (this.getFormStatus()) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      default:
        return '';
    }
  }

  getStatusColor(): string {
    switch (this.getFormStatus()) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return '';
    }
  }

  getStatusBgColor(): string {
    switch (this.getFormStatus()) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return '';
    }
  }
}
