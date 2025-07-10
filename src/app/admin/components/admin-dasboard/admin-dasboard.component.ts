import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { CreatorQuizListComponent } from '../creator-quiz-list/creator-quiz-list.component';

@Component({
  selector: 'app-admin-dasboard',
  standalone: true,
  imports: [RouterLink , CommonModule , CreatorQuizListComponent , RouterOutlet],
  templateUrl: './admin-dasboard.component.html',
  styleUrl: './admin-dasboard.component.css'
})
export class AdminDasboardComponent implements OnInit {

  takenQuizzes: string[] = [];
  quizTitle: string = 'sample-quiz'; // temporary default

  constructor(
    private adminService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getAllTakenQuizTitles().subscribe({
      next: res => {
        this.takenQuizzes = res;
        console.log('✅ Fetched taken quizzes:', res);
      },
      error: err => console.error('❌ Failed to fetch taken quizzes', err)
    });
  }

  viewParticipantResult(title: string) {
    this.router.navigate(['/admin/participant/result', title]);
  }

    viewCreatedQuiz(title: string) {
    this.router.navigate(['/admin/quiz/view', title]);
  }
}
