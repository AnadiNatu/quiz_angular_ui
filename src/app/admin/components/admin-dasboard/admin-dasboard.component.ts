import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { CreatorQuizListComponent } from '../creator-quiz-list/creator-quiz-list.component';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';
import { UsersDTO } from '../../../auth/models/dtos';

@Component({
  selector: 'app-admin-dasboard',
  standalone: true,
  imports: [RouterLink , CommonModule , CreatorQuizListComponent , RouterOutlet , RouterModule],
  templateUrl: './admin-dasboard.component.html',
  styleUrl: './admin-dasboard.component.css'
})
export class AdminDasboardComponent implements OnInit {
  takenQuizzes: string[] = [];
  username: string = '';
  showAdminCard = false;
  profileImageUrl: string = 'assets/default-profile.png';
  userDetails!: UsersDTO;
  toggleMenu = false;


  constructor(
    private adminService: AdminServiceService,
    private authService: AuthService,
    public storage: UserStorageService, // 👈 changed to public
    private router: Router
  ) {}

  ngOnInit(): void {
    this.username = this.storage.getUser().username;

    this.adminService.getAllTakenQuizTitles().subscribe({
      next: res => this.takenQuizzes = res,
      error: err => console.error('Failed to fetch taken quizzes', err)
    });

    // 👇 Get actual user details from service
    this.adminService.getUserDetails().subscribe({
      next: (res) => {
        this.userDetails = res;
        this.profileImageUrl = `https://api.yourapp.com/profiles/${res.username}/avatar`; // or set dynamically
      },
      error: err => console.error('Failed to load user details:', err)
    });
  }

  uploadProfilePhoto(event: any): void {
    const file: File = event.target.files[0];
    if (file && this.username) {
      this.authService.uploadProfilePhoto(this.username, file).subscribe({
        next: (imageUrl) => {
          this.profileImageUrl = imageUrl;
        },
        error: err => console.error('Error uploading image:', err)
      });
    }
  }

  viewParticipantResult(title: string) {
    this.router.navigate(['/admin/participant/result', title]);
  }

  viewCreatedQuiz(title: string) {
    this.router.navigate(['/admin/quiz/view', title]);
  }

  viewAllResultsForQuiz(title: string) {
    this.router.navigate(['/admin/results/all', title]);
  }

  viewAllQuizzes(){
    this.router.navigate(['/admin/creator/quizzes'] , {
      queryParams : {showAll : true},
    });
  }

  toggleAdminCard(): void {
    this.showAdminCard = !this.showAdminCard;
  }

  logout(): void {
  this.storage.logout();
  this.router.navigate(['/login']);
}
}

// COMPONENT RESPONSIVE BUT , NOT YET SCROLLABLE


// NEED TO HAVE PROPER ROUTING TO ACTUAL COMPONENTS  
// "CREATOR-QUIZ-LIST" IS NOT THEMED YOU NEED TO THEME THAT 
// WHEN YOU HOVER OVER QUIZ CARDS THE TRANSITIONS WHERE YOU SEE DETAILS IS NOT SMOOTH SO SOOTH IT OUT 
// AND A BUTTON IN THE QUIZ CARD TO TAKE THE QUIZ AND NAVBAR OF THE "ADMIN-DASHBOARD" TO HAVE THIS ROUTING
// {path : 'participant/quiz/:quizTitle' , loadComponent : () => import('./components/participant-quiz/participant-quiz.component').then(m => m.ParticipantQuizComponent)}
// AND ADD ONE MORE BUTTON IN THE NAVBAR TO SEE THE RESULT AND NAVBAR OF THE "ADMIN-DASHBOARD"
// {path : 'participant/result/:quizTitle' , loadComponent : () => import('./components/quiz-result/quiz-result.component').then(m => m.QuizResultComponent)},
// AND SET THE THEME OF THE COMPONENT TO THIS CSS SAMPLE 
// AND ADD PROPER ROUTING TO THE QUIZ-CARDS AND THE ADMIN-DASHBOARD NAVBAR
// AND THEME THE ADMIN-DASNBOARD WITH THIS SAMPLE THEME

// ---> TS FILE "ADMIN-DASHBOARD"

// ---> HTML FILE "ADMIN-DASHBOARD" 

// ---> SAMPLE CSS