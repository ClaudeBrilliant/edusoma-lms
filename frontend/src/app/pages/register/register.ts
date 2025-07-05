import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { Footer } from '../footer/footer';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  agreeToMarketing: boolean;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
  requirements: {
    length: boolean;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Navbar, Footer],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm: RegisterForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    agreeToMarketing: false
  };

  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  registerError = '';
  registerSuccess = false;

  // Form validation
  firstNameError = '';
  lastNameError = '';
  emailError = '';
  passwordError = '';
  confirmPasswordError = '';
  termsError = '';

  // Password strength
  passwordStrength: PasswordStrength = {
    score: 0,
    label: '',
    color: '',
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      numbers: false,
      symbols: false
    }
  };

  constructor(private router: Router) {}

  onSubmit(): void {
    if (this.isSubmitting) return;

    // Reset errors
    this.resetErrors();

    // Validate form
    if (!this.validateForm()) {
      return;
    }

    this.isSubmitting = true;

    // Simulate API call
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Mock registration logic
      if (this.registerForm.email === 'demo@example.com') {
        this.registerError = 'An account with this email already exists.';
        this.registerSuccess = false;
      } else {
        this.registerSuccess = true;
        this.registerError = '';
        
        // Simulate redirect after successful registration
        setTimeout(() => {
          // Redirect to student dashboard after successful registration
          this.router.navigate(['/student-dashboard']);
        }, 2000);
      }
    }, 2000);
  }

  validateForm(): boolean {
    let isValid = true;

    // First name validation
    if (!this.registerForm.firstName.trim()) {
      this.firstNameError = 'First name is required';
      isValid = false;
    } else if (this.registerForm.firstName.trim().length < 2) {
      this.firstNameError = 'First name must be at least 2 characters';
      isValid = false;
    }

    // Last name validation
    if (!this.registerForm.lastName.trim()) {
      this.lastNameError = 'Last name is required';
      isValid = false;
    } else if (this.registerForm.lastName.trim().length < 2) {
      this.lastNameError = 'Last name must be at least 2 characters';
      isValid = false;
    }

    // Email validation
    if (!this.registerForm.email) {
      this.emailError = 'Email is required';
      isValid = false;
    } else if (!this.isValidEmail(this.registerForm.email)) {
      this.emailError = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!this.registerForm.password) {
      this.passwordError = 'Password is required';
      isValid = false;
    } else if (this.passwordStrength.score < 3) {
      this.passwordError = 'Password is too weak';
      isValid = false;
    }

    // Confirm password validation
    if (!this.registerForm.confirmPassword) {
      this.confirmPasswordError = 'Please confirm your password';
      isValid = false;
    } else if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.confirmPasswordError = 'Passwords do not match';
      isValid = false;
    }

    // Terms validation
    if (!this.registerForm.agreeToTerms) {
      this.termsError = 'You must agree to the terms and conditions';
      isValid = false;
    }

    return isValid;
  }

  resetErrors(): void {
    this.registerError = '';
    this.firstNameError = '';
    this.lastNameError = '';
    this.emailError = '';
    this.passwordError = '';
    this.confirmPasswordError = '';
    this.termsError = '';
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onPasswordChange(): void {
    this.checkPasswordStrength();
    if (this.passwordError) {
      this.passwordError = '';
    }
  }

  onConfirmPasswordChange(): void {
    if (this.confirmPasswordError) {
      this.confirmPasswordError = '';
    }
  }

  onFieldChange(field: string): void {
    switch (field) {
      case 'firstName':
        if (this.firstNameError) this.firstNameError = '';
        break;
      case 'lastName':
        if (this.lastNameError) this.lastNameError = '';
        break;
      case 'email':
        if (this.emailError) this.emailError = '';
        break;
      case 'terms':
        if (this.termsError) this.termsError = '';
        break;
    }
  }

  checkPasswordStrength(): void {
    const password = this.registerForm.password;
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(requirements).filter(Boolean).length;
    
    let label = '';
    let color = '';

    if (score === 0) {
      label = 'Very Weak';
      color = 'text-red-500';
    } else if (score === 1) {
      label = 'Weak';
      color = 'text-orange-500';
    } else if (score === 2) {
      label = 'Fair';
      color = 'text-yellow-500';
    } else if (score === 3) {
      label = 'Good';
      color = 'text-blue-500';
    } else if (score === 4) {
      label = 'Strong';
      color = 'text-green-500';
    } else {
      label = 'Very Strong';
      color = 'text-green-600';
    }

    this.passwordStrength = {
      score,
      label,
      color,
      requirements
    };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  getPasswordInputType(): string {
    return this.showPassword ? 'text' : 'password';
  }

  getConfirmPasswordInputType(): string {
    return this.showConfirmPassword ? 'text' : 'password';
  }

  getPasswordIcon(): string {
    return this.showPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
  }

  getConfirmPasswordIcon(): string {
    return this.showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye';
  }

  getPasswordStrengthBarColor(): string {
    const score = this.passwordStrength.score;
    if (score <= 1) return 'bg-red-500';
    if (score === 2) return 'bg-orange-500';
    if (score === 3) return 'bg-yellow-500';
    if (score === 4) return 'bg-blue-500';
    return 'bg-green-500';
  }

  getPasswordStrengthBarWidth(): string {
    return `${(this.passwordStrength.score / 5) * 100}%`;
  }

  registerWithGoogle(): void {
    console.log('Registering with Google...');
    // Implement Google OAuth
  }

  registerWithFacebook(): void {
    console.log('Registering with Facebook...');
    // Implement Facebook OAuth
  }

  registerWithGithub(): void {
    console.log('Registering with GitHub...');
    // Implement GitHub OAuth
  }

  getFormStatus(): string {
    if (this.registerSuccess) return 'success';
    if (this.registerError) return 'error';
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
