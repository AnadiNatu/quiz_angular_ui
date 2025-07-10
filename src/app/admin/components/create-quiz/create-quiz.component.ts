import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { CreateQuizDTO } from '../../models/admin-dtos';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule , CommonModule],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent {
quizForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminServiceService,
    private router: Router
  ) {
    this.quizForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      totalMarks: ['', [Validators.required, Validators.min(1)]],
      numberOfQuestion: ['', [Validators.required, Validators.min(1)]]
    });
  }

  createQuiz() {
    if (this.quizForm.invalid) return;

    const dto: CreateQuizDTO = this.quizForm.value;

    this.adminService.createQuiz(dto).subscribe({
      next: (res) => {
        alert('✅ Quiz created successfully!');
        this.quizForm.reset();
        // Navigate to view the created quiz or dashboard
        this.router.navigate(['/admin/quiz/view', res.title]); // adjust this if needed
      },
      error: (err) =>
        alert('❌ Error creating quiz: ' + (err?.error?.message || 'Server Error'))
    });
  }
}
