import { Component, OnInit } from '@angular/core';
import { QuestionWrapper, QuizTakenReponse, ResponseDTO, ResponseEvaluationDTO } from '../../models/admin-dtos';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-quiz',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , RouterModule],
  templateUrl: './participant-quiz.component.html',
  styleUrl: './participant-quiz.component.css'
})
export class ParticipantQuizComponent implements OnInit {
  quizTitle = '';
  username = '';
  questions: QuestionWrapper[] = [];
  responseForm!: FormGroup;
  submitted = false;
  evaluations: ResponseEvaluationDTO[] = [];

  searchForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminServiceService,
    private userStorageService: UserStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.userStorageService.getUser();
    if (!user) {
      console.error('No logged-in user found');
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;

    // Init search form
    this.searchForm = this.fb.group({
      searchQuiz: ['']
    });

    // If route param exists
    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';
    if (this.quizTitle) this.loadQuiz(this.quizTitle);
  }

  loadQuiz(title: string): void {
    this.quizTitle = title;
    this.adminService.getQuizForParticipant(this.quizTitle).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.submitted = false;
        this.evaluations = [];
        this.buildForm();
      },
      error: (err) => console.error('Failed to load quiz', err)
    });
  }

  onSearch(): void {
    const title = this.searchForm.value.searchQuiz?.trim();
    if (title) this.loadQuiz(title);
  }

  buildForm(): void {
    const group: { [key: string]: any } = {};
    this.questions.forEach(q => {
      group[q.questionTitle] = [null];
    });
    this.responseForm = this.fb.group(group);
  }

  submitQuiz(): void {
    const raw = this.responseForm.getRawValue();
    const responses: ResponseDTO[] = Object.entries(raw).map(([questionTitle, selectedAnswer]) => ({
      questionTitle,
      selectedAnswer: selectedAnswer as string ?? null
    }));

    const quizResponse: QuizTakenReponse = {
      quizTitle: this.quizTitle,
      userName: this.username,
      responseList: responses
    };

    this.adminService.submitQuizResponse(quizResponse).subscribe({
      next: (res) => {
        this.evaluations = res;
        this.submitted = true;
      },
      error: (err) => console.error('Submission failed', err)
    });
  }

  goToResult(): void {
    this.router.navigate(['/admin/participant/result', this.quizTitle]);
  }
}