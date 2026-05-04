import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder, FormGroup, FormsModule,
  ReactiveFormsModule, Validators
} from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { CreateQuizDTO } from '../../models/admin-dtos';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent implements OnInit {

  quizForm!: FormGroup;
  availableQuestions = 0;
  maxQuestions = 0;
  questionOptions: number[] = [];
  categories: string[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private router: Router,
    private storage: UserStorageService
  ) {}

  ngOnInit(): void {
    this.quizForm = this.fb.group({
      title:             ['', Validators.required],
      category:          ['', Validators.required],
      difficultyLevel:   ['', Validators.required],
      numberOfQuestions: [1,  [Validators.required, Validators.min(1)]]
    });

    this.loadCategories();
  }

  loadCategories(): void {
    this.adminService.getAllCategories().subscribe({
      next:  data  => this.categories = data,
      error: ()    => alert('❌ Failed to load categories.')
    });
  }

  onCategoryChange(): void {
    const category = this.quizForm.get('category')?.value;
    if (category) {
      this.adminService.getQuestionCountByCategory(category).subscribe({
        next: count => {
          this.availableQuestions = count;
          this.maxQuestions = count;
          this.populateQuestionOptions();
        },
        error: () => {
          this.availableQuestions = 0;
          this.maxQuestions = 0;
          this.questionOptions = [];
        }
      });
    }
  }

  onDifficultyChange(): void {
    const category    = this.quizForm.get('category')?.value;
    const difficulty  = this.quizForm.get('difficultyLevel')?.value;
    if (category && difficulty) {
      this.adminService
          .getQuestionCountByCategoryAndDifficulty(category, difficulty)
          .subscribe({
            next: count => {
              this.availableQuestions = count;
              this.maxQuestions = count;
              this.populateQuestionOptions();
            },
            error: () => {
              this.availableQuestions = 0;
              this.maxQuestions = 0;
              this.questionOptions = [];
            }
          });
    }
  }

  populateQuestionOptions(): void {
    this.questionOptions = Array.from(
      { length: this.maxQuestions }, (_, i) => i + 1
    );
  }

  setMaxQuestions(): void {
    this.quizForm.get('numberOfQuestions')?.setValue(this.maxQuestions);
  }

  createQuiz(): void {
    if (this.quizForm.invalid) return;

    const userId = this.storage.getUserId() ?? 0;
    const formVal = this.quizForm.value;

    const dto: CreateQuizDTO = {
      title:             formVal.title,
      category:          formVal.category,
      difficultyLevel:   formVal.difficultyLevel,
      numberOfQuestions: Number(formVal.numberOfQuestions),
      createdByUserId:   userId
    };

    this.adminService.createQuiz(dto).subscribe({
      next: res => {
        alert('✅ Quiz created successfully!');
        this.quizForm.reset();
        this.router.navigate(['/admin/creator/quiz-detail', res.title]);
      },
      error: err =>
        alert('❌ Error: ' + (err?.error?.message || 'Server Error'))
    });
  }
}