import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  type: 'VIDEO' | 'READING' | 'QUIZ' | 'ASSIGNMENT' | 'DISCUSSION';
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  isRequired: boolean;
  materials: ContentMaterial[];
  videoUrl?: string;
  readingContent?: string;
  quiz?: Quiz;
  assignment?: Assignment;
  discussion?: Discussion;
  completedAt?: Date;
  progress: number; // 0-100
}

interface ContentMaterial {
  id: string;
  title: string;
  type: 'PDF' | 'VIDEO' | 'AUDIO' | 'LINK' | 'DOCUMENT';
  url: string;
  size?: string;
  duration?: number;
  downloadCount: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  attempts: number;
  maxAttempts: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  points: number;
  submissionType: 'FILE' | 'TEXT' | 'LINK';
  submitted: boolean;
  submittedAt?: Date;
  grade?: number;
  feedback?: string;
}

interface Discussion {
  id: string;
  title: string;
  description: string;
  posts: DiscussionPost[];
  isActive: boolean;
}

interface DiscussionPost {
  id: string;
  author: string;
  content: string;
  timestamp: Date;
  replies: DiscussionPost[];
}

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './content.html',
  styleUrl: './content.css'
})
export class Content implements OnInit {
  lessons: Lesson[] = [];
  selectedLesson: Lesson | null = null;
  currentLessonIndex = 0;
  loading = true;
  searchTerm = '';
  selectedType = 'all';
  selectedStatus = 'all';
  showCompleted = true;
  Math = Math;

  constructor() {}

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(): void {
    // Mock data - in real app, this would come from a service
    this.lessons = [
      {
        id: '1',
        title: 'Introduction to Web Development',
        description: 'Learn the basics of HTML, CSS, and JavaScript',
        duration: 45,
        type: 'VIDEO',
        status: 'COMPLETED',
        isRequired: true,
        progress: 100,
        videoUrl: 'https://example.com/video1.mp4',
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        materials: [
          {
            id: '1',
            title: 'Web Development Basics PDF',
            type: 'PDF',
            url: 'https://example.com/basics.pdf',
            size: '2.5 MB',
            downloadCount: 45
          },
          {
            id: '2',
            title: 'Code Examples',
            type: 'DOCUMENT',
            url: 'https://example.com/examples.zip',
            size: '1.2 MB',
            downloadCount: 32
          }
        ]
      },
      {
        id: '2',
        title: 'HTML Fundamentals',
        description: 'Master HTML structure, elements, and semantic markup',
        duration: 60,
        type: 'VIDEO',
        status: 'IN_PROGRESS',
        isRequired: true,
        progress: 75,
        videoUrl: 'https://example.com/video2.mp4',
        materials: [
          {
            id: '3',
            title: 'HTML Cheat Sheet',
            type: 'PDF',
            url: 'https://example.com/html-cheat.pdf',
            size: '800 KB',
            downloadCount: 28
          }
        ]
      },
      {
        id: '3',
        title: 'CSS Styling Basics',
        description: 'Learn CSS selectors, properties, and layout techniques',
        duration: 90,
        type: 'READING',
        status: 'NOT_STARTED',
        isRequired: true,
        progress: 0,
        readingContent: 'CSS is a style sheet language used for describing the presentation of a document written in HTML...',
        materials: [
          {
            id: '4',
            title: 'CSS Reference Guide',
            type: 'PDF',
            url: 'https://example.com/css-guide.pdf',
            size: '1.5 MB',
            downloadCount: 15
          }
        ]
      },
      {
        id: '4',
        title: 'JavaScript Fundamentals Quiz',
        description: 'Test your knowledge of JavaScript basics',
        duration: 30,
        type: 'QUIZ',
        status: 'NOT_STARTED',
        isRequired: true,
        progress: 0,
        quiz: {
          id: '1',
          title: 'JavaScript Basics Quiz',
          questions: [
            {
              id: '1',
              question: 'What is the correct way to declare a variable in JavaScript?',
              type: 'MULTIPLE_CHOICE',
              options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
              correctAnswer: 'var x = 5;',
              points: 10
            },
            {
              id: '2',
              question: 'JavaScript is a case-sensitive language.',
              type: 'TRUE_FALSE',
              correctAnswer: 'true',
              points: 5
            }
          ],
          timeLimit: 30,
          passingScore: 70,
          attempts: 0,
          maxAttempts: 3
        },
        materials: []
      },
      {
        id: '5',
        title: 'Build Your First Website',
        description: 'Create a complete website using HTML, CSS, and JavaScript',
        duration: 120,
        type: 'ASSIGNMENT',
        status: 'NOT_STARTED',
        isRequired: true,
        progress: 0,
        assignment: {
          id: '1',
          title: 'Personal Portfolio Website',
          description: 'Create a personal portfolio website with at least 3 pages...',
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          points: 100,
          submissionType: 'FILE',
          submitted: false
        },
        materials: []
      },
      {
        id: '6',
        title: 'Web Development Discussion',
        description: 'Share your thoughts and ask questions about web development',
        duration: 45,
        type: 'DISCUSSION',
        status: 'NOT_STARTED',
        isRequired: false,
        progress: 0,
        discussion: {
          id: '1',
          title: 'Web Development Best Practices',
          description: 'Discuss modern web development practices and tools',
          posts: [
            {
              id: '1',
              author: 'John Doe',
              content: 'What are your favorite CSS frameworks?',
              timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
              replies: []
            }
          ],
          isActive: true
        },
        materials: []
      }
    ];

    this.selectedLesson = this.lessons[0];
    this.loading = false;
  }

  selectLesson(lesson: Lesson): void {
    this.selectedLesson = lesson;
    this.currentLessonIndex = this.lessons.findIndex(l => l.id === lesson.id);
  }

  getFilteredLessons(): Lesson[] {
    let filtered = [...this.lessons];

    // Filter by search term
    if (this.searchTerm) {
      filtered = filtered.filter(lesson => 
        lesson.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        lesson.description.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (this.selectedType !== 'all') {
      filtered = filtered.filter(lesson => lesson.type === this.selectedType);
    }

    // Filter by status
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(lesson => lesson.status === this.selectedStatus);
    }

    // Filter completed lessons
    if (!this.showCompleted) {
      filtered = filtered.filter(lesson => lesson.status !== 'COMPLETED');
    }

    return filtered;
  }

  getTypeColor(type: string): string {
    switch (type) {
      case 'VIDEO': return 'text-blue-500 bg-blue-100';
      case 'READING': return 'text-green-500 bg-green-100';
      case 'QUIZ': return 'text-purple-500 bg-purple-100';
      case 'ASSIGNMENT': return 'text-orange-500 bg-orange-100';
      case 'DISCUSSION': return 'text-pink-500 bg-pink-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'text-green-500 bg-green-100';
      case 'IN_PROGRESS': return 'text-yellow-500 bg-yellow-100';
      case 'NOT_STARTED': return 'text-gray-500 bg-gray-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETED': return 'fas fa-check-circle';
      case 'IN_PROGRESS': return 'fas fa-play-circle';
      case 'NOT_STARTED': return 'fas fa-circle';
      default: return 'fas fa-circle';
    }
  }

  getTypeIcon(type: string): string {
    switch (type) {
      case 'VIDEO': return 'fas fa-play';
      case 'READING': return 'fas fa-book';
      case 'QUIZ': return 'fas fa-question-circle';
      case 'ASSIGNMENT': return 'fas fa-tasks';
      case 'DISCUSSION': return 'fas fa-comments';
      default: return 'fas fa-file';
    }
  }

  formatDuration(minutes: number): string {
    if (minutes < 60) {
      return `${minutes} min`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return `${hours}h ${remainingMinutes}m`;
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getProgressColor(progress: number): string {
    if (progress >= 80) return 'text-green-500';
    if (progress >= 50) return 'text-yellow-500';
    return 'text-red-500';
  }

  getProgressBarColor(progress: number): string {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  }

  startLesson(lesson: Lesson): void {
    console.log('Starting lesson:', lesson.id);
    // TODO: Navigate to lesson content
  }

  continueLesson(lesson: Lesson): void {
    console.log('Continuing lesson:', lesson.id);
    // TODO: Resume lesson from where left off
  }

  completeLesson(lesson: Lesson): void {
    console.log('Completing lesson:', lesson.id);
    lesson.status = 'COMPLETED';
    lesson.progress = 100;
    lesson.completedAt = new Date();
  }

  downloadMaterial(material: ContentMaterial): void {
    console.log('Downloading material:', material.id);
    // TODO: Handle file download
  }

  getTotalLessons(): number {
    return this.lessons.length;
  }

  getCompletedLessons(): number {
    return this.lessons.filter(lesson => lesson.status === 'COMPLETED').length;
  }

  getInProgressLessons(): number {
    return this.lessons.filter(lesson => lesson.status === 'IN_PROGRESS').length;
  }

  getTotalProgress(): number {
    if (this.lessons.length === 0) return 0;
    const totalProgress = this.lessons.reduce((sum, lesson) => sum + lesson.progress, 0);
    return Math.round(totalProgress / this.lessons.length);
  }

  getTotalDuration(): number {
    return this.lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
  }

  getCompletedDuration(): number {
    return this.lessons
      .filter(lesson => lesson.status === 'COMPLETED')
      .reduce((sum, lesson) => sum + lesson.duration, 0);
  }
}
