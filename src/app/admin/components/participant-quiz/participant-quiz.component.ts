import { Component, OnInit } from '@angular/core';
import {
  QuestionResponseDTO, QuizSubmitRequest,
  ResponseDTO, QuizResultDTO, ResultDTO
} from '../../models/admin-dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule],
  templateUrl: './participant-quiz.component.html',
  styleUrl: './participant-quiz.component.css'
})
export class ParticipantQuizComponent implements OnInit {

  // quiz selection
  allQuizzes: { id: number; title: string }[] = [];
  selectedQuizId = 0;
  searchText = '';
  showSearch = true;

  // quiz state
  quizId = 0;
  quizTitle = '';
  questions: QuestionResponseDTO[] = [];
  responseForm!: FormGroup;

  // timer
  timer = 5;
  showTimer = false;
  private timerInterval: any;

  // result state
  submitted = false;
  resultSummary: ResultDTO | null = null;
  currentResult: QuizResultDTO | null = null;

  // errors
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminServiceService,
    private userStorage: UserStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.userStorage.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    // Load all quizzes for dropdown
    this.adminService.getAllQuizzesByCreator().subscribe({
      next: quizzes => {
        this.allQuizzes = quizzes.map(q => ({ id: q.id, title: q.title }));
      },
      error: () => this.errorMessage = 'Failed to load quizzes.'
    });

    // Route param is quiz id
    const paramId = this.route.snapshot.paramMap.get('quizTitle');
    if (paramId && !isNaN(Number(paramId))) {
      this.startQuizTimer(Number(paramId));
    }
  }

  onSearch(): void {
    const title = this.searchText.trim();
    if (!title) return;
    this.adminService.getQuizByQuizTitle(title).subscribe({
      next: quiz => this.startQuizTimer(quiz.id),
      error: () => this.errorMessage = 'Quiz not found.'
    });
  }

  onDropdownSelect(): void {
    if (this.selectedQuizId) {
      this.startQuizTimer(this.selectedQuizId);
    }
  }

  startQuizTimer(id: number): void {
    this.quizId   = id;
    this.showTimer = true;
    this.timer     = 5;
    this.errorMessage = '';

    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.timerInterval);
        this.showTimer  = false;
        this.showSearch = false;
        this.loadQuiz(id);
      }
    }, 1000);
  }

  loadQuiz(id: number): void {
    this.adminService.startQuiz(id).subscribe({
      next: questions => {
        this.questions      = questions;
        this.quizTitle      = questions[0]?.questionTitle ? '' : '';
        this.submitted      = false;
        this.resultSummary  = null;
        this.currentResult  = null;

        // get title from our list
        const found = this.allQuizzes.find(q => q.id === id);
        if (found) this.quizTitle = found.title;

        this.buildForm();
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Failed to start quiz. You may have already taken it.';
        this.showSearch = true;
      }
    });
  }

  buildForm(): void {
    const group: { [key: string]: any } = {};
    this.questions.forEach(q => {
      group[q.id.toString()] = [null];
    });
    this.responseForm = this.fb.group(group);
  }

  submitQuiz(): void {
    const raw = this.responseForm.getRawValue();

    const responses: ResponseDTO[] = this.questions.map(q => ({
      questionId:     q.id,
      selectedAnswer: raw[q.id] ?? null
    }));

    const userId = this.userStorage.getUserId() ?? 0;

    const request: QuizSubmitRequest = {
      quizId:    this.quizId,
      userId:    userId,
      responses: responses
    };

    this.adminService.submitQuiz(request).subscribe({
      next: result => {
        this.resultSummary = result;
        this.submitted     = true;
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Submission failed.';
      }
    });
  }

  viewFullResults(): void {
    this.adminService.getUserResults().subscribe({
      next: results => {
        const found = results.find(r => r.quizId === this.quizId);
        if (found) this.currentResult = found;
      },
      error: () => this.errorMessage = 'Could not fetch detailed results.'
    });
  }

  viewReportCard(): void {
    const userId = this.userStorage.getUserId() ?? 0;
    this.adminService.getParticipantReportDocument(userId).subscribe({
      next: html => {
        const w = window.open('', '_blank');
        w?.document.write(html);
        w?.document.close();
      },
      error: () => alert('Failed to load report card.')
    });
  }

  retakeSearch(): void {
    this.showSearch    = true;
    this.questions     = [];
    this.submitted     = false;
    this.resultSummary = null;
    this.currentResult = null;
    this.errorMessage  = '';
    this.quizTitle     = '';
  }
}