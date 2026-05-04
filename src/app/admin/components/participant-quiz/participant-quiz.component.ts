import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  QuestionResponseDTO, QuizSubmitRequest,
  ResponseDTO, QuizResultDTO, ResultDTO
} from '../../models/admin-dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';
import { CommonModule, DecimalPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-participant-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FormsModule, DecimalPipe, DatePipe],
  templateUrl: './participant-quiz.component.html',
  styleUrl: './participant-quiz.component.css'
})
export class ParticipantQuizComponent implements OnInit, OnDestroy {

  // Selection state
  allQuizzes: { id: number; title: string }[] = [];
  selectedQuizId = 0;
  searchText     = '';
  showSearch     = true;

  // Quiz state
  quizId    = 0;
  quizTitle = '';
  questions: QuestionResponseDTO[] = [];
  responseForm!: FormGroup;

  // Timer
  timer     = 5;
  showTimer = false;
  private timerInterval: any;

  // Result state
  submitted      = false;
  resultSummary: ResultDTO | null       = null;
  detailedResult: QuizResultDTO | null  = null;

  // Errors
  errorMessage = '';

  constructor(
    private route:        ActivatedRoute,
    private adminService: AdminServiceService,
    private storage:      UserStorageService,
    private fb:           FormBuilder,
    private router:       Router
  ) {}

  ngOnInit(): void {
    if (!this.storage.getToken()) {
      this.router.navigate(['/login']);
      return;
    }

    // Load quiz list for dropdown
    this.adminService.getAllQuizzesByCreator().subscribe({
      next:  qs => this.allQuizzes = qs.map(q => ({ id: q.id, title: q.title })),
      error: ()  => {}
    });

    // If launched with a quiz ID in route
    const paramId = this.route.snapshot.paramMap.get('quizId');
    if (paramId && !isNaN(Number(paramId))) {
      this.startQuizTimer(Number(paramId));
    }
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  onSearch(): void {
    const text = this.searchText.trim();
    if (!text) return;

    this.adminService.getQuizByQuizTitle(text).subscribe({
      next:  quiz => this.startQuizTimer(quiz.id),
      error: ()   => this.errorMessage = 'Quiz not found.'
    });
  }

  onDropdownSelect(): void {
    if (this.selectedQuizId) this.startQuizTimer(this.selectedQuizId);
  }

  startQuizTimer(id: number): void {
    this.quizId       = id;
    this.showTimer    = true;
    this.timer        = 5;
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
        this.questions     = questions;
        this.submitted     = false;
        this.resultSummary = null;
        this.detailedResult = null;

        const found = this.allQuizzes.find(q => q.id === id);
        if (found) this.quizTitle = found.title;

        this.buildForm();
      },
      error: err => {
        this.errorMessage = err?.error?.message
          || 'Failed to start quiz. You may have already taken it.';
        this.showSearch = true;
      }
    });
  }

  buildForm(): void {
    const group: { [key: number]: any } = {};
    this.questions.forEach(q => { group[q.id] = [null]; });
    this.responseForm = this.fb.group(group);
  }

  submitQuiz(): void {
    const raw = this.responseForm.getRawValue();

    const responses: ResponseDTO[] = this.questions.map(q => ({
      questionId:     q.id,
      selectedAnswer: raw[q.id] ?? null
    }));

    const request: QuizSubmitRequest = {
      quizId:    this.quizId,
      userId:    this.storage.getUserId() ?? 0,
      responses
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

  loadDetailedResult(): void {
    this.adminService.getUserResults().subscribe({
      next: results => {
        this.detailedResult =
          results.find(r => r.quizId === this.quizId) ?? null;
      },
      error: () => this.errorMessage = 'Could not fetch detailed results.'
    });
  }

  openReportCard(): void {
    const userId = this.storage.getUserId() ?? 0;
    this.adminService.getParticipantReportDocument(userId).subscribe({
      next: html => {
        const w = window.open('', '_blank');
        w?.document.write(html);
        w?.document.close();
      },
      error: () => alert('Failed to open report card.')
    });
  }

  reset(): void {
    this.showSearch     = true;
    this.questions      = [];
    this.submitted      = false;
    this.resultSummary  = null;
    this.detailedResult = null;
    this.errorMessage   = '';
    this.quizTitle      = '';
    this.selectedQuizId = 0;
    this.searchText     = '';
  }
}