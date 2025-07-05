import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  instructorId: string;
  instructorName: string;
  dueDate: Date;
  totalPoints: number;
  timeLimit?: number; // in minutes
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
  submissions: Submission[];
}

export interface Question {
  id: string;
  assignmentId: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'MATCHING';
  points: number;
  order: number;
  options?: QuestionOption[];
  correctAnswer?: string;
  correctAnswers?: string[]; // for multiple correct answers
  rubric?: string; // for essay questions
}

export interface QuestionOption {
  id: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  order: number;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: Date;
  completedAt?: Date;
  timeSpent: number; // in minutes
  score: number;
  totalPoints: number;
  grade: string;
  status: 'IN_PROGRESS' | 'SUBMITTED' | 'GRADED' | 'LATE';
  answers: Answer[];
  feedback?: string;
  gradedBy?: string;
  gradedAt?: Date;
}

export interface Answer {
  id: string;
  submissionId: string;
  questionId: string;
  answerText: string;
  selectedOptions?: string[];
  isCorrect?: boolean;
  pointsEarned: number;
  feedback?: string;
}

export interface AssignmentStats {
  totalAssignments: number;
  publishedAssignments: number;
  totalSubmissions: number;
  averageScore: number;
  completionRate: number;
  pendingGrading: number;
}

export interface StudentAssignmentView {
  assignment: Assignment;
  submission?: Submission;
  isSubmitted: boolean;
  isGraded: boolean;
  timeRemaining?: number; // in minutes
  canSubmit: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AssignmentsService {
  private apiUrl = 'http://localhost:3000/api'; // Adjust based on your backend URL

  constructor(private http: HttpClient) { }

  // Assignment Management (Instructor)
  getAssignments(): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/assignments`);
  }

  getAssignmentById(id: string): Observable<Assignment> {
    return this.http.get<Assignment>(`${this.apiUrl}/assignments/${id}`);
  }

  getCourseAssignments(courseId: string): Observable<Assignment[]> {
    return this.http.get<Assignment[]>(`${this.apiUrl}/courses/${courseId}/assignments`);
  }

  createAssignment(assignment: Partial<Assignment>): Observable<Assignment> {
    return this.http.post<Assignment>(`${this.apiUrl}/assignments`, assignment);
  }

  updateAssignment(id: string, assignment: Partial<Assignment>): Observable<Assignment> {
    return this.http.put<Assignment>(`${this.apiUrl}/assignments/${id}`, assignment);
  }

  deleteAssignment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/assignments/${id}`);
  }

  publishAssignment(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/assignments/${id}/publish`, {});
  }

  unpublishAssignment(id: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/assignments/${id}/unpublish`, {});
  }

  // Question Management
  addQuestion(assignmentId: string, question: Partial<Question>): Observable<Question> {
    return this.http.post<Question>(`${this.apiUrl}/assignments/${assignmentId}/questions`, question);
  }

  updateQuestion(assignmentId: string, questionId: string, question: Partial<Question>): Observable<Question> {
    return this.http.put<Question>(`${this.apiUrl}/assignments/${assignmentId}/questions/${questionId}`, question);
  }

  deleteQuestion(assignmentId: string, questionId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/assignments/${assignmentId}/questions/${questionId}`);
  }

  reorderQuestions(assignmentId: string, questionIds: string[]): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/assignments/${assignmentId}/questions/reorder`, { questionIds });
  }

  // Submission Management
  getSubmissions(assignmentId: string): Observable<Submission[]> {
    return this.http.get<Submission[]>(`${this.apiUrl}/assignments/${assignmentId}/submissions`);
  }

  getSubmissionById(submissionId: string): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/submissions/${submissionId}`);
  }

  getStudentSubmission(assignmentId: string, studentId: string): Observable<Submission> {
    return this.http.get<Submission>(`${this.apiUrl}/assignments/${assignmentId}/students/${studentId}/submission`);
  }

  submitAssignment(assignmentId: string, submission: Partial<Submission>): Observable<Submission> {
    return this.http.post<Submission>(`${this.apiUrl}/assignments/${assignmentId}/submit`, submission);
  }

  // Grading
  gradeSubmission(submissionId: string, grades: Partial<Answer>[]): Observable<Submission> {
    return this.http.put<Submission>(`${this.apiUrl}/submissions/${submissionId}/grade`, { grades });
  }

  autoGradeSubmission(submissionId: string): Observable<Submission> {
    return this.http.put<Submission>(`${this.apiUrl}/submissions/${submissionId}/auto-grade`, {});
  }

  // Analytics
  getAssignmentStats(): Observable<AssignmentStats> {
    return this.http.get<AssignmentStats>(`${this.apiUrl}/assignments/stats`);
  }

  getAssignmentAnalytics(assignmentId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/assignments/${assignmentId}/analytics`);
  }

  // Student Views
  getStudentAssignments(studentId: string): Observable<StudentAssignmentView[]> {
    return this.http.get<StudentAssignmentView[]>(`${this.apiUrl}/students/${studentId}/assignments`);
  }

  // Mock data for development
  getMockAssignments(): Assignment[] {
    return [
      {
        id: '1',
        title: 'Introduction to JavaScript Fundamentals',
        description: 'Test your understanding of JavaScript basics including variables, functions, and control structures.',
        courseId: 'course1',
        courseTitle: 'Web Development Fundamentals',
        instructorId: 'instructor1',
        instructorName: 'Dr. Sarah Johnson',
        dueDate: new Date('2024-02-15T23:59:59'),
        totalPoints: 100,
        timeLimit: 60,
        isPublished: true,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-01-20'),
        questions: this.getMockQuestions('1'),
        submissions: this.getMockSubmissions('1')
      },
      {
        id: '2',
        title: 'React Component Architecture',
        description: 'Demonstrate your knowledge of React components, props, state, and lifecycle methods.',
        courseId: 'course2',
        courseTitle: 'Advanced React Development',
        instructorId: 'instructor2',
        instructorName: 'Prof. Michael Chen',
        dueDate: new Date('2024-02-20T23:59:59'),
        totalPoints: 150,
        timeLimit: 90,
        isPublished: true,
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-01-25'),
        questions: this.getMockQuestions('2'),
        submissions: this.getMockSubmissions('2')
      },
      {
        id: '3',
        title: 'Database Design Principles',
        description: 'Apply database normalization concepts and design efficient database schemas.',
        courseId: 'course3',
        courseTitle: 'Database Management Systems',
        instructorId: 'instructor3',
        instructorName: 'Dr. Emily Davis',
        dueDate: new Date('2024-02-10T23:59:59'),
        totalPoints: 120,
        timeLimit: 75,
        isPublished: false,
        createdAt: new Date('2024-01-30'),
        updatedAt: new Date('2024-01-30'),
        questions: this.getMockQuestions('3'),
        submissions: []
      }
    ];
  }

  getMockQuestions(assignmentId: string): Question[] {
    const questions: { [key: string]: Question[] } = {
      '1': [
        {
          id: 'q1',
          assignmentId: '1',
          questionText: 'Which of the following is the correct way to declare a variable in JavaScript?',
          questionType: 'MULTIPLE_CHOICE',
          points: 10,
          order: 1,
          options: [
            { id: 'opt1', questionId: 'q1', optionText: 'var myVariable = 5;', isCorrect: true, order: 1 },
            { id: 'opt2', questionId: 'q1', optionText: 'variable myVariable = 5;', isCorrect: false, order: 2 },
            { id: 'opt3', questionId: 'q1', optionText: 'v myVariable = 5;', isCorrect: false, order: 3 },
            { id: 'opt4', questionId: 'q1', optionText: 'declare myVariable = 5;', isCorrect: false, order: 4 }
          ],
          correctAnswer: 'opt1'
        },
        {
          id: 'q2',
          assignmentId: '1',
          questionText: 'What is the output of console.log(typeof null)?',
          questionType: 'MULTIPLE_CHOICE',
          points: 10,
          order: 2,
          options: [
            { id: 'opt5', questionId: 'q2', optionText: 'null', isCorrect: false, order: 1 },
            { id: 'opt6', questionId: 'q2', optionText: 'undefined', isCorrect: false, order: 2 },
            { id: 'opt7', questionId: 'q2', optionText: 'object', isCorrect: true, order: 3 },
            { id: 'opt8', questionId: 'q2', optionText: 'number', isCorrect: false, order: 4 }
          ],
          correctAnswer: 'opt7'
        },
        {
          id: 'q3',
          assignmentId: '1',
          questionText: 'Explain the difference between let, const, and var in JavaScript.',
          questionType: 'ESSAY',
          points: 30,
          order: 3,
          rubric: 'Points for: scope explanation (10), hoisting explanation (10), reassignment rules (10)'
        }
      ],
      '2': [
        {
          id: 'q4',
          assignmentId: '2',
          questionText: 'What is the purpose of the useEffect hook in React?',
          questionType: 'ESSAY',
          points: 50,
          order: 1,
          rubric: 'Points for: side effects explanation (20), dependency array (15), cleanup function (15)'
        },
        {
          id: 'q5',
          assignmentId: '2',
          questionText: 'React components must always return a single element.',
          questionType: 'TRUE_FALSE',
          points: 10,
          order: 2,
          correctAnswer: 'false'
        }
      ],
      '3': [
        {
          id: 'q6',
          assignmentId: '3',
          questionText: 'What is the primary goal of database normalization?',
          questionType: 'MULTIPLE_CHOICE',
          points: 20,
          order: 1,
          options: [
            { id: 'opt9', questionId: 'q6', optionText: 'To increase storage space', isCorrect: false, order: 1 },
            { id: 'opt10', questionId: 'q6', optionText: 'To eliminate data redundancy', isCorrect: true, order: 2 },
            { id: 'opt11', questionId: 'q6', optionText: 'To make queries slower', isCorrect: false, order: 3 },
            { id: 'opt12', questionId: 'q6', optionText: 'To add more tables', isCorrect: false, order: 4 }
          ],
          correctAnswer: 'opt10'
        }
      ]
    };
    return questions[assignmentId] || [];
  }

  getMockSubmissions(assignmentId: string): Submission[] {
    const submissions: { [key: string]: Submission[] } = {
      '1': [
        {
          id: 'sub1',
          assignmentId: '1',
          studentId: 'student1',
          studentName: 'John Doe',
          submittedAt: new Date('2024-02-14T15:30:00'),
          completedAt: new Date('2024-02-14T16:25:00'),
          timeSpent: 55,
          score: 85,
          totalPoints: 100,
          grade: 'B+',
          status: 'GRADED',
          answers: [
            {
              id: 'ans1',
              submissionId: 'sub1',
              questionId: 'q1',
              answerText: 'opt1',
              selectedOptions: ['opt1'],
              isCorrect: true,
              pointsEarned: 10,
              feedback: 'Correct!'
            },
            {
              id: 'ans2',
              submissionId: 'sub1',
              questionId: 'q2',
              answerText: 'opt7',
              selectedOptions: ['opt7'],
              isCorrect: true,
              pointsEarned: 10,
              feedback: 'Correct!'
            },
            {
              id: 'ans3',
              submissionId: 'sub1',
              questionId: 'q3',
              answerText: 'Let has block scope, const is for constants, var has function scope...',
              isCorrect: undefined,
              pointsEarned: 25,
              feedback: 'Good explanation of scope and hoisting. Could elaborate more on const reassignment rules.'
            }
          ],
          feedback: 'Good work overall! Pay attention to const reassignment rules.',
          gradedBy: 'Dr. Sarah Johnson',
          gradedAt: new Date('2024-02-15T10:00:00')
        }
      ],
      '2': [
        {
          id: 'sub2',
          assignmentId: '2',
          studentId: 'student2',
          studentName: 'Jane Smith',
          submittedAt: new Date('2024-02-19T14:20:00'),
          completedAt: new Date('2024-02-19T15:45:00'),
          timeSpent: 85,
          score: 0,
          totalPoints: 150,
          grade: 'F',
          status: 'SUBMITTED',
          answers: [
            {
              id: 'ans4',
              submissionId: 'sub2',
              questionId: 'q4',
              answerText: 'useEffect is used for side effects in functional components...',
              isCorrect: undefined,
              pointsEarned: 0,
              feedback: ''
            },
            {
              id: 'ans5',
              submissionId: 'sub2',
              questionId: 'q5',
              answerText: 'true',
              selectedOptions: ['true'],
              isCorrect: false,
              pointsEarned: 0,
              feedback: 'Incorrect. React components can return multiple elements using fragments.'
            }
          ]
        }
      ]
    };
    return submissions[assignmentId] || [];
  }

  getMockAssignmentStats(): AssignmentStats {
    return {
      totalAssignments: 15,
      publishedAssignments: 12,
      totalSubmissions: 89,
      averageScore: 78.5,
      completionRate: 85.2,
      pendingGrading: 7
    };
  }

  getMockStudentAssignmentViews(): StudentAssignmentView[] {
    return [
      {
        assignment: this.getMockAssignments()[0],
        submission: this.getMockSubmissions('1')[0],
        isSubmitted: true,
        isGraded: true,
        canSubmit: false
      },
      {
        assignment: this.getMockAssignments()[1],
        submission: this.getMockSubmissions('2')[0],
        isSubmitted: true,
        isGraded: false,
        canSubmit: false
      },
      {
        assignment: this.getMockAssignments()[2],
        submission: undefined,
        isSubmitted: false,
        isGraded: false,
        timeRemaining: 1440, // 24 hours in minutes
        canSubmit: true
      }
    ];
  }
} 