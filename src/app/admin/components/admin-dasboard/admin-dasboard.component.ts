import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { CreatorQuizListComponent } from '../creator-quiz-list/creator-quiz-list.component';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';
import { UsersDTO } from '../../../auth/models/dtos';
import { QuizDTO } from '../../models/admin-dtos';

@Component({
  selector: 'app-admin-dasboard',
  standalone: true,
  imports: [RouterLink, CommonModule, CreatorQuizListComponent, RouterOutlet, RouterModule],
  templateUrl: './admin-dasboard.component.html',
  styleUrl: './admin-dasboard.component.css'
})
export class AdminDasboardComponent implements OnInit {

  takenQuizTitles: string[] = [];
  username    = '';
  userRole    = '';
  showAdminCard  = false;
  profileImageUrl = 'assets/default-profile.png';
  userDetails: UsersDTO | null = null;
  toggleMenu  = false;

  constructor(
    private adminService: AdminServiceService,
    private authService:  AuthService,
    public  storage:      UserStorageService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    const user = this.storage.getUser();
    this.username = user?.username ?? 'User';
    this.userRole = user?.role     ?? '';

    // Only participants have taken-quiz titles;
    // for ADMIN/CURATOR we skip this call to avoid a 403
    if (this.userRole === 'PARTICIPANT') {
      this.adminService.getAllTakenQuizTitles().subscribe({
        next: titles => this.takenQuizTitles = titles,
        error: err   => console.warn('Could not load taken quizzes:', err)
      });
    }

    // Load enriched user details from auth service
    this.adminService.getUserDetails().subscribe({
      next: res => {
        this.userDetails = res;
        // only update avatar if the server returns a profile picture
        if (res.profilePicture) {
          this.profileImageUrl = res.profilePicture;
        }
      },
      error: err => console.warn('Could not load user details:', err)
    });
  }

  uploadProfilePhoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file  = input.files?.[0];
    if (file && this.username) {
      this.authService.uploadProfilePhoto(this.username, file).subscribe({
        next: url  => this.profileImageUrl = url,
        error: err => console.error('Upload failed:', err)
      });
    }
  }

  // Called by CreatorQuizListComponent (viewQuiz) output — emits QuizDTO
  viewCreatedQuiz(quiz: QuizDTO): void {
    this.router.navigate(['/admin/quiz/view', quiz.title]);
  }

  // Called by CreatorQuizListComponent (viewAllResults) output — emits QuizDTO
  viewAllResultsForQuiz(quiz: QuizDTO): void {
    this.router.navigate(['/admin/results/all', quiz.id]);
  }

  viewParticipantResult(): void {
    this.router.navigate(['/admin/participant/result']);
  }

  toggleAdminCard(): void {
    this.showAdminCard = !this.showAdminCard;
  }

  logout(): void {
    this.storage.logout();
    this.router.navigate(['/login']);
  }
}