import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreatedQuizDTO } from '../../models/admin-dtos';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-view-created-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './view-created-quiz.component.html',
  styleUrl: './view-created-quiz.component.css'
})
export class ViewCreatedQuizComponent implements OnInit {

  quizTitle: string = '';
  createdQuiz: CreatedQuizDTO | null = null;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminServiceService
  ) {}

  ngOnInit(): void {
    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';

    if (this.quizTitle) {
      this.adminService.getCreatedQuiz(this.quizTitle).subscribe({
        next: (res) => this.createdQuiz = res,
        error: (err) => this.errorMessage = err.error?.message || 'Quiz not found'
      });
    } else {
      this.errorMessage = 'No quiz title provided';
    }
  }

  goBack() {
    this.router.navigate(['/admin']);
  }
}
