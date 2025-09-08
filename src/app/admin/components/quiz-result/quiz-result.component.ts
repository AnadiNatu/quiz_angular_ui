import { Component, OnInit } from '@angular/core';
import { ResultDTO } from '../../models/admin-dtos';
import { ActivatedRoute } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.css'
})
export class QuizResultComponent implements OnInit{

  quizTitle : string = '';
  result !: ResultDTO;
  isLoaded = false;
  hasError = false;
  
  constructor(
    private route : ActivatedRoute,
    private adminService : AdminServiceService
  ){}

  ngOnInit(): void {
    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';

    if(this.quizTitle){
      this.adminService.getUserResult(this.quizTitle).subscribe({
        next : (res) => {
          this.result = res;
          this.isLoaded = true;
        },
        error : (err) => {
          console.error('Error fetching result' , err);
          this.hasError = true;
        }
      });
    }
  }
}

// HEY CHAT CAN YOU USE THIS COMPONENT "QUIZ-RESULT" IN THE "QUIZ-PARTICIPANT" COMPONENT TO SHOW THE RESULT OF THE USER WHO HAS TAKEN THE QUIZ 
// ---> PARTICIPANT-QUIZ TS FILE
// ---> PARTICIPANT-QUIZ HTML FILE
// ---> QUIZ-RESULT TS FILE
// ---> QUIZ-RESULT HTML FILE
