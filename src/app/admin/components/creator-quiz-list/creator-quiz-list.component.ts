import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuizDTO } from '../../models/admin-dtos';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-creator-quiz-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './creator-quiz-list.component.html',
  styleUrl: './creator-quiz-list.component.css'
})
export class CreatorQuizListComponent implements OnInit {

  quizzes: QuizDTO[] = [];
  errorMessage = '';

  @Output() viewQuiz = new EventEmitter<string>();
  
  constructor(private adminService: AdminServiceService, private router: Router) {}

  ngOnInit(): void {
    this.adminService.getAllQuizzesByCreator().subscribe({
      next: (res) => this.quizzes = res,
      error: (err) => this.errorMessage = err.error?.message || 'Could not load quizzes'
    });
  }

  viewQuizDetails(title: string) {
    this.router.navigate(['/admin/creator/quiz-detail', title]);
  }

  // FOR CREATOR-QUIZ-LIST COMPONENT
    onViewQuiz(title: string) {
    this.viewQuiz.emit(title);
  } 
}


