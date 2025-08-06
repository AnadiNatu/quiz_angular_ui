import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { QuizDTO } from '../../models/admin-dtos';
import { AdminServiceService } from '../../services/admin-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creator-quiz-list',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './creator-quiz-list.component.html',
  styleUrl: './creator-quiz-list.component.css',
})
export class CreatorQuizListComponent implements OnInit {
  quizzes: QuizDTO[] = [];
  errorMessage = '';
  hovered: string = '';
  searchText : string = '';
  showAllQuizzes : boolean = false;

  @Output() viewQuiz = new EventEmitter<string>();
  @Output() viewAllResults = new EventEmitter<string>(); // NEW output for results

  constructor(
    private adminService: AdminServiceService,
    private router: Router,
    private route : ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const currentPath = this.router.url;
      this.showAllQuizzes = currentPath.includes('admin/all/quizzes');
      this.loadQuizzes();
    })
  }

  loadQuizzes(){
    if(this.showAllQuizzes){
      this.adminService.getAllQuiz().subscribe({
        next : (res) => (this.quizzes = res),
        error : (err) => (this.errorMessage = err.error?.message || 'Could not load quizzes'),
      });
    }else{
      this.adminService.getAllQuizzesByCreator().subscribe({
        next : (res) => (this.quizzes = res),
        error : (err) => (this.errorMessage = err.error?.message || 'Could not load quizzes')
      });
    }
  }

  onSearch(){
    if(!this.searchText.trim()){
      this.loadQuizzes();
      return;
    }

    this.adminService.getQuizByQuizTitle(this.searchText.trim()).subscribe({
      next : (quiz) => (this.quizzes = [quiz]),
      error : (err) => (this.errorMessage = err.error?.message || 'Quiz not found'),
    })
  }

  viewQuizDetails(title: string) {
    this.router.navigate(['/admin/creator/quiz-detail', title]);
  }

  // FOR CREATOR-QUIZ-LIST COMPONENT
  onViewQuiz(title: string) {
    this.viewQuiz.emit(title);
  }

  onViewResults(title: string) {
    this.viewAllResults.emit(title);
  }
}

// NEED TO MAKE THE COMPONENT RESPONSIVE AND SCROLLABLE 