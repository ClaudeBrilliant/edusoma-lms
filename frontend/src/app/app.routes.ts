import { Routes } from '@angular/router';
import { InstructorDashboard } from './pages/instructor-dashboard/instructor-dashboard';
import { HomeComponent } from './pages/home/home';
import { Analytics } from './components/analytics/analytics';
import { CertificateComponent } from './components/certificate/certificate';
import { AssignmentsComponent } from './components/assignments/assignments';
import { EnrollmentComponent } from './components/enrollment/enrollment';
import { CoursesComponent } from './components/courses/courses';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register').then(m => m.Register)
  },
  {
    path: 'student-dashboard',
    loadComponent: () => import('./pages/student-dashboard/student-dashboard').then(m => m.StudentDashboard),
    canActivate: [AuthGuard],
    data: { roles: ['student', 'instructor', 'admin'] }
  },
  {
    path: 'instructor-dashboard',
    component: InstructorDashboard,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['instructor', 'admin'] }
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard').then(m => m.AdminDashboardComponent),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile').then(m => m.Profile),
    canActivate: [AuthGuard]
  },
  {
    path: 'instructors',
    loadComponent: () => import('./pages/instructors/instructors').then(m => m.Instructors)
  },
  {
    path: 'analytics',
    component: Analytics,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['instructor', 'admin'] }
  },
  {
    path: 'certificates',
    component: CertificateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'assignments',
    component: AssignmentsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'enrollment',
    component: EnrollmentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courses',
    component: CoursesComponent
  },
  {
    path: 'mycourses',
    loadComponent: () => import('./pages/mycourses/mycourses').then(m => m.Mycourses),
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users/users').then(m => m.Users),
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] }
  },
  {
    path: 'content',
    loadComponent: () => import('./components/content/content').then(m => m.Content),
    canActivate: [AuthGuard]
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized').then(m => m.Unauthorized)
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];
