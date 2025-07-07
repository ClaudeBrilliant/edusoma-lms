import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CoursesService, Course, Module } from '../../services/courses.service';
import { QuizService, Quiz, QuizQuestion } from '../../services/quiz.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-course-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './course-editor.html',
  styleUrl: './course-editor.css'
})
export class CourseEditor implements OnInit {
  courseId: string = '';
  course: Course | null = null;
  modules: Module[] = [];
  quizzes: Quiz[] = [];
  loading = true;
  error: string | null = null;

  // Module creation
  showModuleModal = false;
  creatingModule = false;
  newModule = {
    title: '',
    description: '',
    order: 1,
    duration: 30
  };

  // Quiz creation
  showQuizModal = false;
  creatingQuiz = false;
  newQuiz = {
    title: '',
    courseId: '',
    timeLimit: 30,
    questions: [] as QuizQuestion[]
  };

  // Question creation
  showQuestionModal = false;
  addingQuestion = false;
  newQuestion = {
    text: '',
    type: 'MULTIPLE_CHOICE' as 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY',
    options: ['', '', '', ''],
    answer: '',
    order: 1
  };

  selectedTab = 'modules';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private coursesService: CoursesService,
    private quizService: QuizService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      if (this.courseId) {
        this.loadCourse();
        this.loadModules();
        this.loadQuizzes();
      }
    });

    // Check for tab parameter in URL
    this.route.queryParams.subscribe(queryParams => {
      if (queryParams['tab']) {
        this.selectedTab = queryParams['tab'];
      }
    });
  }

  loadCourse(): void {
    this.coursesService.getCourseById(this.courseId).subscribe({
      next: (course) => {
        this.course = course;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading course:', error);
        this.error = 'Failed to load course';
        this.loading = false;
      }
    });
  }

  loadModules(): void {
    this.coursesService.getModules(this.courseId).subscribe({
      next: (modules) => {
        this.modules = modules.sort((a, b) => a.order - b.order);
      },
      error: (error) => {
        console.error('Error loading modules:', error);
      }
    });
  }

  loadQuizzes(): void {
    this.quizService.getQuizzesByCourse(this.courseId).subscribe({
      next: (quizzes) => {
        this.quizzes = quizzes;
      },
      error: (error) => {
        console.error('Error loading quizzes:', error);
      }
    });
  }

  // Module Management
  createModule(): void {
    this.showModuleModal = true;
    this.resetModuleForm();
  }

  closeModuleModal(): void {
    this.showModuleModal = false;
    this.resetModuleForm();
  }

  resetModuleForm(): void {
    this.newModule = {
      title: '',
      description: '',
      order: this.modules.length + 1,
      duration: 30
    };
  }

  submitCreateModule(): void {
    if (!this.validateModuleForm()) {
      return;
    }

    this.creatingModule = true;
    const moduleData = {
      ...this.newModule,
      courseId: this.courseId
    };

    this.coursesService.createModule(moduleData).subscribe({
      next: (module) => {
        this.notificationService.showSuccess('Module Created', 'Module has been created successfully');
        this.closeModuleModal();
        this.loadModules();
        this.creatingModule = false;
      },
      error: (error) => {
        console.error('Error creating module:', error);
        this.notificationService.showError('Error', 'Failed to create module');
        this.creatingModule = false;
      }
    });
  }

  validateModuleForm(): boolean {
    if (!this.newModule.title.trim()) {
      this.notificationService.showError('Error', 'Please enter a module title');
      return false;
    }
    if (!this.newModule.description.trim()) {
      this.notificationService.showError('Error', 'Please enter a module description');
      return false;
    }
    if (this.newModule.order < 1) {
      this.notificationService.showError('Error', 'Order must be at least 1');
      return false;
    }
    return true;
  }

  deleteModule(moduleId: string): void {
    if (confirm('Are you sure you want to delete this module?')) {
      this.coursesService.deleteModule(moduleId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Module Deleted', 'Module has been deleted successfully');
          this.loadModules();
        },
        error: (error) => {
          console.error('Error deleting module:', error);
          this.notificationService.showError('Error', 'Failed to delete module');
        }
      });
    }
  }

  // Quiz Management
  createQuiz(): void {
    this.showQuizModal = true;
    this.resetQuizForm();
  }

  closeQuizModal(): void {
    this.showQuizModal = false;
    this.resetQuizForm();
  }

  resetQuizForm(): void {
    this.newQuiz = {
      title: '',
      courseId: this.courseId,
      timeLimit: 30,
      questions: []
    };
  }

  submitCreateQuiz(): void {
    if (!this.validateQuizForm()) {
      return;
    }

    this.creatingQuiz = true;
    const quizData = {
      ...this.newQuiz,
      courseId: this.courseId
    };

    this.quizService.createQuiz(quizData).subscribe({
      next: (quiz) => {
        this.notificationService.showSuccess('Quiz Created', 'Quiz has been created successfully');
        this.closeQuizModal();
        this.loadQuizzes();
        this.creatingQuiz = false;
      },
      error: (error) => {
        console.error('Error creating quiz:', error);
        this.notificationService.showError('Error', 'Failed to create quiz');
        this.creatingQuiz = false;
      }
    });
  }

  validateQuizForm(): boolean {
    if (!this.newQuiz.title.trim()) {
      this.notificationService.showError('Error', 'Please enter a quiz title');
      return false;
    }
    if (this.newQuiz.questions.length === 0) {
      this.notificationService.showError('Error', 'Please add at least one question');
      return false;
    }
    return true;
  }

  deleteQuiz(quizId: string): void {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizService.deleteQuiz(quizId).subscribe({
        next: () => {
          this.notificationService.showSuccess('Quiz Deleted', 'Quiz has been deleted successfully');
          this.loadQuizzes();
        },
        error: (error) => {
          console.error('Error deleting quiz:', error);
          this.notificationService.showError('Error', 'Failed to delete quiz');
        }
      });
    }
  }

  // Question Management
  addQuestion(): void {
    this.showQuestionModal = true;
    this.resetQuestionForm();
  }

  closeQuestionModal(): void {
    this.showQuestionModal = false;
    this.resetQuestionForm();
  }

  resetQuestionForm(): void {
    this.newQuestion = {
      text: '',
      type: 'MULTIPLE_CHOICE',
      options: ['', '', '', ''],
      answer: '',
      order: this.newQuiz.questions.length + 1
    };
  }

  submitAddQuestion(): void {
    if (!this.validateQuestionForm()) {
      return;
    }

    this.addingQuestion = true;
    const questionData = {
      ...this.newQuestion,
      quizId: '', // Will be set when quiz is created
      id: Date.now().toString() // Temporary ID
    };

    // Add question to the quiz
    this.newQuiz.questions.push(questionData);
    this.closeQuestionModal();
    this.addingQuestion = false;
  }

  validateQuestionForm(): boolean {
    if (!this.newQuestion.text.trim()) {
      this.notificationService.showError('Error', 'Please enter a question');
      return false;
    }
    if (this.newQuestion.type === 'MULTIPLE_CHOICE') {
      const validOptions = this.newQuestion.options.filter(opt => opt.trim() !== '');
      if (validOptions.length < 2) {
        this.notificationService.showError('Error', 'Please add at least 2 options');
        return false;
      }
      if (!this.newQuestion.answer.trim()) {
        this.notificationService.showError('Error', 'Please select the correct answer');
        return false;
      }
    } else if (!this.newQuestion.answer.trim()) {
      this.notificationService.showError('Error', 'Please enter the correct answer');
      return false;
    }
    return true;
  }

  removeQuestion(index: number): void {
    this.newQuiz.questions.splice(index, 1);
    // Update order numbers
    this.newQuiz.questions.forEach((q, i) => {
      q.order = i + 1;
    });
  }

  // Utility methods
  switchTab(tab: string): void {
    this.selectedTab = tab;
  }

  formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  }

  getQuestionTypeLabel(type: string): string {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Multiple Choice';
      case 'TRUE_FALSE': return 'True/False';
      case 'FILL_BLANK': return 'Fill in the Blank';
      case 'ESSAY': return 'Essay';
      default: return type;
    }
  }

  isInstructor(): boolean {
    return this.authService.currentUser?.role === 'instructor' || this.authService.currentUser?.role === 'admin';
  }
} 