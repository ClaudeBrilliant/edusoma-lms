import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentsService, Assignment, Question, Submission, AssignmentStats, StudentAssignmentView } from '../../services/assignments.service';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './assignments.html',
  styleUrl: './assignments.css'
})
export class AssignmentsComponent implements OnInit {
  assignments: Assignment[] = [];
  studentAssignments: StudentAssignmentView[] = [];
  stats: AssignmentStats | null = null;
  loading = true;
  selectedTab = 'instructor';
  selectedAssignment: Assignment | null = null;
  selectedSubmission: Submission | null = null;
  isCreatingAssignment = false;
  isEditingAssignment = false;
  isTakingAssignment = false;
  isGradingSubmission = false;
  searchTerm = '';
  selectedStatus = 'all';
  selectedCourse = 'all';
  currentQuestionIndex = 0;
  studentAnswers: { [questionId: string]: any } = {};
  timeRemaining: number = 0;
  timerInterval: any;

  // Form data for creating/editing assignments
  assignmentForm = {
    title: '',
    description: '',
    courseId: '',
    dueDate: '',
    totalPoints: 100,
    timeLimit: 60,
    isPublished: false
  };

  // Form data for questions
  questionForm = {
    questionText: '',
    questionType: 'MULTIPLE_CHOICE' as const,
    points: 10,
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ],
    correctAnswer: '',
    rubric: ''
  };

  constructor(private assignmentsService: AssignmentsService) {}

  ngOnInit(): void {
    this.loadAssignmentData();
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  loadAssignmentData(): void {
    // Using mock data for development
    this.assignments = this.assignmentsService.getMockAssignments();
    this.studentAssignments = this.assignmentsService.getMockStudentAssignmentViews();
    this.stats = this.assignmentsService.getMockAssignmentStats();
    this.loading = false;
  }

  switchTab(tab: string): void {
    this.selectedTab = tab;
    this.resetForms();
  }

  resetForms(): void {
    this.isCreatingAssignment = false;
    this.isEditingAssignment = false;
    this.isTakingAssignment = false;
    this.isGradingSubmission = false;
    this.selectedAssignment = null;
    this.selectedSubmission = null;
    this.currentQuestionIndex = 0;
    this.studentAnswers = {};
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'text-blue-500 bg-blue-100';
      case 'SUBMITTED':
        return 'text-yellow-500 bg-yellow-100';
      case 'GRADED':
        return 'text-green-500 bg-green-100';
      case 'LATE':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'IN_PROGRESS':
        return 'fas fa-clock';
      case 'SUBMITTED':
        return 'fas fa-paper-plane';
      case 'GRADED':
        return 'fas fa-check-circle';
      case 'LATE':
        return 'fas fa-exclamation-triangle';
      default:
        return 'fas fa-question-circle';
    }
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }

  getTimeRemaining(dueDate: Date): string {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff <= 0) return 'Overdue';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  }

  getTimeRemainingColor(dueDate: Date): string {
    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    
    if (diff <= 0) return 'text-red-500';
    if (diff <= 24 * 60 * 60 * 1000) return 'text-yellow-500';
    if (diff <= 7 * 24 * 60 * 60 * 1000) return 'text-orange-500';
    return 'text-green-500';
  }

  createAssignment(): void {
    this.isCreatingAssignment = true;
    this.resetAssignmentForm();
  }

  editAssignment(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.isEditingAssignment = true;
    this.assignmentForm = {
      title: assignment.title,
      description: assignment.description,
      courseId: assignment.courseId,
      dueDate: assignment.dueDate.toISOString().split('T')[0],
      totalPoints: assignment.totalPoints,
      timeLimit: assignment.timeLimit || 60,
      isPublished: assignment.isPublished
    };
  }

  saveAssignment(): void {
    // TODO: Implement assignment saving
    console.log('Saving assignment:', this.assignmentForm);
    this.isCreatingAssignment = false;
    this.isEditingAssignment = false;
  }

  deleteAssignment(assignment: Assignment): void {
    if (confirm(`Are you sure you want to delete "${assignment.title}"?`)) {
      // TODO: Implement assignment deletion
      console.log('Deleting assignment:', assignment.id);
    }
  }

  publishAssignment(assignment: Assignment): void {
    // TODO: Implement assignment publishing
    console.log('Publishing assignment:', assignment.id);
  }

  unpublishAssignment(assignment: Assignment): void {
    // TODO: Implement assignment unpublishing
    console.log('Unpublishing assignment:', assignment.id);
  }

  viewSubmissions(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    // TODO: Load submissions for this assignment
  }

  takeAssignment(assignment: Assignment): void {
    this.selectedAssignment = assignment;
    this.isTakingAssignment = true;
    this.currentQuestionIndex = 0;
    this.studentAnswers = {};
    
    if (assignment.timeLimit) {
      this.timeRemaining = assignment.timeLimit;
      this.startTimer();
    }
  }

  startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        this.submitAssignment();
      }
    }, 60000); // Update every minute
  }

  submitAssignment(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
    
    // TODO: Implement assignment submission
    console.log('Submitting assignment with answers:', this.studentAnswers);
    this.isTakingAssignment = false;
  }

  gradeSubmission(submission: Submission): void {
    this.selectedSubmission = submission;
    this.isGradingSubmission = true;
  }

  saveGrades(): void {
    // TODO: Implement grade saving
    console.log('Saving grades for submission:', this.selectedSubmission?.id);
    this.isGradingSubmission = false;
  }

  autoGradeSubmission(submission: Submission): void {
    // TODO: Implement auto-grading
    console.log('Auto-grading submission:', submission.id);
  }

  addQuestion(): void {
    // TODO: Implement question addition
    console.log('Adding question:', this.questionForm);
  }

  editQuestion(question: Question): void {
    // TODO: Implement question editing
    console.log('Editing question:', question.id);
  }

  deleteQuestion(question: Question): void {
    if (confirm('Are you sure you want to delete this question?')) {
      // TODO: Implement question deletion
      console.log('Deleting question:', question.id);
    }
  }

  nextQuestion(): void {
    if (this.selectedAssignment && this.currentQuestionIndex < this.selectedAssignment.questions.length - 1) {
      this.currentQuestionIndex++;
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    }
  }

  selectAnswer(questionId: string, answer: any): void {
    this.studentAnswers[questionId] = answer;
  }

  getFilteredAssignments(): Assignment[] {
    let filtered = this.assignments;

    if (this.searchTerm) {
      filtered = filtered.filter(assignment => 
        assignment.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        assignment.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(assignment => {
        if (this.selectedStatus === 'published') return assignment.isPublished;
        if (this.selectedStatus === 'draft') return !assignment.isPublished;
        return true;
      });
    }

    if (this.selectedCourse !== 'all') {
      filtered = filtered.filter(assignment => assignment.courseId === this.selectedCourse);
    }

    return filtered;
  }

  getFilteredStudentAssignments(): StudentAssignmentView[] {
    let filtered = this.studentAssignments;

    if (this.searchTerm) {
      filtered = filtered.filter(view => 
        view.assignment.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        view.assignment.courseTitle.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(view => {
        if (this.selectedStatus === 'submitted') return view.isSubmitted;
        if (this.selectedStatus === 'graded') return view.isGraded;
        if (this.selectedStatus === 'pending') return !view.isSubmitted;
        return true;
      });
    }

    return filtered;
  }

  getPublishedAssignments(): Assignment[] {
    return this.assignments.filter(assignment => assignment.isPublished);
  }

  getDraftAssignments(): Assignment[] {
    return this.assignments.filter(assignment => !assignment.isPublished);
  }

  getSubmissionsForAssignment(assignmentId: string): Submission[] {
    const assignment = this.assignments.find(a => a.id === assignmentId);
    return assignment?.submissions || [];
  }

  getPendingGrading(): Submission[] {
    return this.assignments
      .flatMap(assignment => assignment.submissions)
      .filter(submission => submission.status === 'SUBMITTED');
  }

  getCurrentQuestion(): Question | null {
    if (!this.selectedAssignment) return null;
    return this.selectedAssignment.questions[this.currentQuestionIndex] || null;
  }

  getQuestionProgress(): number {
    if (!this.selectedAssignment) return 0;
    return ((this.currentQuestionIndex + 1) / this.selectedAssignment.questions.length) * 100;
  }

  isQuestionAnswered(questionId: string): boolean {
    return this.studentAnswers.hasOwnProperty(questionId);
  }

  resetAssignmentForm(): void {
    this.assignmentForm = {
      title: '',
      description: '',
      courseId: '',
      dueDate: '',
      totalPoints: 100,
      timeLimit: 60,
      isPublished: false
    };
  }

  resetQuestionForm(): void {
    this.questionForm = {
      questionText: '',
      questionType: 'MULTIPLE_CHOICE',
      points: 10,
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ],
      correctAnswer: '',
      rubric: ''
    };
  }

  getGradeColor(grade: string): string {
    const gradeNum = parseFloat(grade);
    if (gradeNum >= 90) return 'text-green-500';
    if (gradeNum >= 80) return 'text-blue-500';
    if (gradeNum >= 70) return 'text-yellow-500';
    if (gradeNum >= 60) return 'text-orange-500';
    return 'text-red-500';
  }

  getScorePercentage(score: number, totalPoints: number): number {
    return (score / totalPoints) * 100;
  }

  getAssignmentById(assignmentId: string): Assignment | undefined {
    return this.assignments.find(assignment => assignment.id === assignmentId);
  }

  viewSubmission(submission: Submission): void {
    this.selectedSubmission = submission;
    // TODO: Implement submission viewing
    console.log('Viewing submission:', submission.id);
  }
}
