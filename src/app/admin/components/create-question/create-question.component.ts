import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router, RouterLink } from '@angular/router';
import { CreateQuestionDTO, QuestionDTO } from '../../models/admin-dtos';

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css',
})
export class CreateQuestionComponent implements OnInit {
  questionForm: FormGroup;
  selectedAnswer: string = '';
  categories: string[] = [];
  addNewCategory: boolean = false;
  submittedQuestion: QuestionDTO | null = null;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    public router: Router
  ) {
    this.questionForm = this.fb.group({
      questionTitle: ['', Validators.required],
      category: ['', Validators.required],
      difficultyLevel: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      rightAnswer: ['', Validators.required],
      newCategory: [''],
    });
  }

  ngOnInit(): void {
    this.adminService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: () => alert('Failed to load categories'),
    });
  }

  selectRightAnswer(optionKey: string): void {
    const selectedValue = this.questionForm.get(optionKey)?.value;
    this.questionForm.patchValue({ rightAnswer: selectedValue });
    this.selectedAnswer = optionKey;
  }

  onCategoryChange(value: string): void {
    this.addNewCategory = value == 'ADD_NEW';
    if (this.addNewCategory) {
      this.questionForm.get('category')?.setValidators(Validators.required);
    } else {
      this.questionForm.get('newCategory')?.setValue('');
      this.questionForm.get('newCategory')?.clearValidators();
    }

    this.questionForm.get('newCategory')?.updateValueAndValidity();
  }

  submitQuestion() {
    console.log('🔔 Submit button clicked');

    if (this.questionForm.invalid) {
      console.warn('⚠️ Form is invalid');
      this.questionForm.markAllAsTouched();
      return;
    }

    const formValue = this.questionForm.value;
    const finalCategory =
      formValue.category === 'ADD_NEW'
        ? formValue.newCategory
        : formValue.category;

    const dto: CreateQuestionDTO = {
      questionTitle: formValue.questionTitle,
      category: finalCategory,
      difficultyLevel: formValue.difficultyLevel,
      option1: formValue.option1,
      option2: formValue.option2,
      option3: formValue.option3,
      option4: formValue.option4,
      rightAnswer: formValue.rightAnswer,
    };

    console.log('📦 Payload to submit:', dto);

    this.adminService.addQuestion(dto).subscribe({
      next: (response: QuestionDTO) => {
        console.log('✅ Question added successfully');
        alert('✅ Question added successfully!');
        this.questionForm.reset();
        this.addNewCategory = false;
        // this.router.navigate(['']);
        this.submittedQuestion = response;
      },
      error: (err) => {
        console.error('❌ Error adding question:', err);
        alert(
          '❌ Error adding question: ' + (err?.error?.message || 'Server Error')
        );
      },
    });
  }

  setCorrectAnswer(optionKey: 'option1' | 'option2' | 'option3' | 'option4') {
    const optionValue = this.questionForm.get(optionKey)?.value;
    this.questionForm.get('rightAnswer')?.setValue(optionValue);
  }
}
