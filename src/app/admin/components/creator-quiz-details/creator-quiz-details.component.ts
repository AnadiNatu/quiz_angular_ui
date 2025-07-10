import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreatorUserDTO } from '../../models/admin-dtos';
import { ActivatedRoute } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';

@Component({
  selector: 'app-creator-quiz-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creator-quiz-details.component.html',
  styleUrl: './creator-quiz-details.component.css'
})
export class CreatorQuizDetailsComponent implements OnInit{

  quizTitle : string = ' ';
  quizDetail : CreatorUserDTO | null = null;
  errorMessage = '';

  constructor(private route : ActivatedRoute , private adminService : AdminServiceService){}
  
   ngOnInit(): void {
    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';

    if (this.quizTitle) {
      this.adminService.getAllQuestionsOfQuiz(this.quizTitle).subscribe({
        next: (res) => this.quizDetail = res,
        error: (err) => {
          this.errorMessage = err?.error?.message || 'Failed to load quiz details';
        }
      });
    } else {
      this.errorMessage = 'Quiz title is missing in the URL.';
    }
  }
}
