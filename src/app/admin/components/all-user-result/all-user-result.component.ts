import { Component, OnInit } from '@angular/core';
import { QuizResultDTO } from '../../models/admin-dtos';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-all-user-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './all-user-result.component.html',
  styleUrl: './all-user-result.component.css'
})
export class AllUserResultComponent implements OnInit {

  quizId: number = 0;
  quizTitle = '';
  results: QuizResultDTO[] = [];
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminServiceService
  ) {}

  ngOnInit(): void {
    // Route param is now quizId (number)
    const param = this.route.snapshot.paramMap.get('quizTitle');
    this.quizId = Number(param);

    if (this.quizId) {
      this.adminService.getAllUserResults(this.quizId).subscribe({
        next: res => {
          this.results  = res;
          this.quizTitle = res[0]?.quizTitle ?? `Quiz #${this.quizId}`;
          this.loading  = false;
        },
        error: () => {
          this.error   = '❌ Failed to load results';
          this.loading = false;
        }
      });
    } else {
      this.error   = 'Invalid quiz ID';
      this.loading = false;
    }
  }

  viewDocument(): void {
    this.adminService.getQuizResultDocument(this.quizId).subscribe({
      next: html => {
        const w = window.open('', '_blank');
        w?.document.write(html);
        w?.document.close();
      },
      error: () => alert('Failed to load document')
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/creator/quizzes']);
  }
}