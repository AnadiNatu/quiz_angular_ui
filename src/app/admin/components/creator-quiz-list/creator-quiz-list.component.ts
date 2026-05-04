import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuizDTO } from '../../models/admin-dtos';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creator-quiz-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creator-quiz-list.component.html',
  styleUrl: './creator-quiz-list.component.css'
})
export class CreatorQuizListComponent implements OnInit {

  quizzes:      QuizDTO[] = [];
  errorMessage  = '';
  hoveredId     = 0;
  searchText    = '';
  showAllQuizzes = false;

  // Emit full QuizDTO so parent gets id + title
  @Output() viewQuiz       = new EventEmitter<QuizDTO>();
  @Output() viewAllResults = new EventEmitter<QuizDTO>();

  constructor(
    private adminService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.showAllQuizzes = this.router.url.includes('all/quizzes');
    this.loadQuizzes();
  }

  loadQuizzes(): void {
    const src$ = this.showAllQuizzes
      ? this.adminService.getAllQuiz()
      : this.adminService.getAllQuizzesByCreator();

    src$.subscribe({
      next:  res => this.quizzes = res,
      error: err => this.errorMessage = err?.error?.message || 'Could not load quizzes'
    });
  }

  onSearch(): void {
    if (!this.searchText.trim()) { this.loadQuizzes(); return; }

    this.adminService.getQuizByQuizTitle(this.searchText.trim()).subscribe({
      next:  quiz => this.quizzes = [quiz],
      error: err  => this.errorMessage = err?.error?.message || 'Quiz not found'
    });
  }

  viewQuizDetails(quiz: QuizDTO): void {
    this.router.navigate(['/admin/creator/quiz-detail', quiz.title]);
  }

  takeQuiz(quiz: QuizDTO): void {
    this.router.navigate(['/admin/participant/quiz', quiz.id]);
  }

  onViewQuiz(quiz: QuizDTO):       void { this.viewQuiz.emit(quiz); }
  onViewResults(quiz: QuizDTO):    void { this.viewAllResults.emit(quiz); }
}