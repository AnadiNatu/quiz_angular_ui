import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { CreateQuestionDTO } from '../../models/admin-dtos';

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule , CommonModule],
  templateUrl: './create-question.component.html',
  styleUrl: './create-question.component.css'
})
export class CreateQuestionComponent {

    questionForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private router: Router
  ) {
    this.questionForm = this.fb.group({
      questionTitle: ['', Validators.required],
      category: ['', Validators.required],
      difficultyLevel: ['', Validators.required],
      option1: ['', Validators.required],
      option2: ['', Validators.required],
      option3: ['', Validators.required],
      option4: ['', Validators.required],
      rightAnswer: ['', Validators.required]
    });
  }

  submitQuestion() {
    if (this.questionForm.invalid) return;

    const dto: CreateQuestionDTO = this.questionForm.value;

    this.adminService.addQuestion(dto).subscribe({
      next: () => {
        alert('✅ Question added successfully!');
        this.questionForm.reset();
        this.router.navigate(['/admin']); // go back to dashboard
      },
      error: err => alert('❌ Error adding question: ' + err?.error?.message || 'Server Error')
    });
  }
}
