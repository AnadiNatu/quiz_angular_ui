import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { FormsModule } from '@angular/forms';
import { QuizDTO, QuizStatsDTO } from '../../models/admin-dtos';

@Component({
  selector: 'app-creator-quiz-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './creator-quiz-details.component.html',
  styleUrl: './creator-quiz-details.component.css'
})
export class CreatorQuizDetailsComponent implements OnInit {

  quizTitle = '';
  quiz: QuizDTO | null = null;
  questionTitles: string[] = [];
  stats: QuizStatsDTO | null = null;
  errorMessage = '';
  allQuizTitles: string[] = [];
  selectedQuizTitle = '';
  searchText = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminServiceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.adminService.getAllQuizTitles().subscribe({
      next:  titles => this.allQuizTitles = titles,
      error: ()     => this.errorMessage  = 'Could not fetch quiz titles.'
    });

    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';
    if (this.quizTitle) {
      this.fetchQuizDetails(this.quizTitle);
    }
  }

  fetchQuizDetails(title: string): void {
    this.errorMessage = '';
    this.quiz = null;
    this.questionTitles = [];
    this.stats = null;

    this.adminService.getQuizByQuizTitle(title).subscribe({
      next: quiz => {
        this.quiz = quiz;
        this.quizTitle = quiz.title;

        // fetch question titles
        this.adminService.getQuestionTitlesOfQuiz(quiz.id).subscribe({
          next: titles => this.questionTitles = titles,
          error: ()    => this.questionTitles = []
        });

        // fetch stats
        this.adminService.getQuizStats(quiz.id).subscribe({
          next: stats => this.stats = stats,
          error: ()   => this.stats = null
        });
      },
      error: err => {
        this.errorMessage = err?.error?.message || 'Failed to load quiz details.';
      }
    });
  }

  onSearch(): void {
    const trimmed = this.searchText.trim();
    if (trimmed) this.fetchQuizDetails(trimmed);
  }

  onDropdownSelect(title: string): void {
    this.searchText = title;
    this.fetchQuizDetails(title);
  }

  goToAllResults(): void {
    if (this.quiz) {
      this.router.navigate(['/admin/results/all', this.quiz.id]);
    }
  }
}