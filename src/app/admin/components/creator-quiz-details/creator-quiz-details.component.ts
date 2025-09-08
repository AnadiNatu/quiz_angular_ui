import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CreatorUserDTO } from '../../models/admin-dtos';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-creator-quiz-details',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './creator-quiz-details.component.html',
  styleUrl: './creator-quiz-details.component.css'
})
export class CreatorQuizDetailsComponent implements OnInit{

  quizTitle : string = '';
  quizDetail : CreatorUserDTO | null = null;
  errorMessage : string = '';
  allQuizTitles : string[] = [];
  selectedQuizTitle : string = '';
  searchText : string = '';

  constructor(private route : ActivatedRoute , private adminService : AdminServiceService , private router : Router){}
  
   ngOnInit(): void {
    this.adminService.getAllQuizTitles().subscribe({
      next : (titles) => this.allQuizTitles = titles,
      error : () => this.errorMessage = 'Could not fetch quiz titles.'
    });

    this.quizTitle = this.route.snapshot.paramMap.get('quizTitle') || '';
    if(this.quizTitle){
      this.fetchQuizDetails(this.quizTitle);
    }
  }

  fetchQuizDetails(title : string){
    this.adminService.getAllQuestionsOfQuiz(title).subscribe({
      next : (res) => {
        this.quizDetail = res;
        this.errorMessage = '';
      },
      error : (err) => {
        this.errorMessage = err?.error?.errorMessage || 'Failed to loaded quiz details';
        this.quizDetail = null;
      }
    });
  }

  onSearch() {
    const trimmed = this.searchText.trim();
    if(trimmed){
      this.fetchQuizDetails(trimmed);
    }
  }

  onDropdownSelect(title : string){
    this.searchText = title;
    this.fetchQuizDetails(title);
  }

  goToAllResults(){
    this.router.navigate(['/admin/results/all' , this.quizTitle]);  
  }
}
// need to show the empty , when no input 
// need to combine the search and the dropdown 