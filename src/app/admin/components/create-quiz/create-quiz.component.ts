import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminServiceService } from '../../services/admin-service.service';
import { Router } from '@angular/router';
import { CreateQuizDTO } from '../../models/admin-dtos';

@Component({
  selector: 'app-create-quiz',
  standalone: true,
  imports: [ReactiveFormsModule , FormsModule , CommonModule],
  templateUrl: './create-quiz.component.html',
  styleUrl: './create-quiz.component.css'
})
export class CreateQuizComponent implements OnInit {

  quizForm !: FormGroup;
  availableQuestions : number = 0;
  maxQuestions : number = 0;
  questionOptions : number[] = [];
  categories : string[] = [];

  constructor(
    private fb : FormBuilder,
    private adminService : AdminServiceService,
    private router : Router
  ){}

  ngOnInit() : void {
    this.quizForm = this.fb.group({
      quizTitle : ['' , Validators.required],
      category : ['' , Validators.required],
      difficultyLevel : ['' , Validators.required],
      noOfQuestions : [0 , Validators.required]
    });

    this.loadCategories();
  }

  loadCategories() : void{
    this.adminService.getAllCategories().subscribe({
      next : (data) => this.categories = data,
      error : () => {
        this.categories = [];
        alert('❌ Failed to load categories.')
      }
    })
  }

  onCategoryChange() : void{
    const category = this.quizForm.get('category')?.value;
    if(category){
      this.adminService.getQuestionCountByCategory(category).subscribe({
        next : (count) => {
          this.availableQuestions = count;
          this.maxQuestions = count;
          this.populateQuestionOptions();
        },
        error : () => {
          this.availableQuestions = 0;
          this.maxQuestions = 0;
          this.questionOptions = [];
        }
      });
    }
  }

  onDifficultyChange() : void{
    const category = this.quizForm.get('category')?.value;
    const difficulty = this.quizForm.get('difficultyLevel')?.value;

    if(category && difficulty){

      this.adminService.getQuestionCountByCategoryAndDifficulty(category , difficulty).subscribe({
        next : (count) => {
          this.availableQuestions = count;
          this.maxQuestions = count;
          this.populateQuestionOptions();
        },
        error : () => {
          this.availableQuestions = 0;
          this.maxQuestions = 0;
          this.questionOptions = [];
        }
      })
    }
  }

  populateQuestionOptions() : void{
    this.questionOptions = Array.from({length : this.maxQuestions + 1} , (_ , i) => i).slice(1);
  }

  setMaxQuestions() : void{
    this.quizForm.get('noOfQuestions')?.setValue(this.maxQuestions);
  }

    createQuiz(): void {
    if (this.quizForm.invalid) return;

    const dto: CreateQuizDTO = this.quizForm.value;

    this.adminService.createQuiz(dto).subscribe({
      next: (res) => {
        alert('✅ Quiz created successfully!');
        this.quizForm.reset();
        this.router.navigate(['/admin/quiz/view', res.title]);
      },
      error: (err) =>
        alert('❌ Error creating quiz: ' + (err?.error?.message || 'Server Error'))
    });
  }
}

// quizForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private adminService: AdminServiceService,
//     private router: Router
//   ) {
//     this.quizForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       totalMarks: ['', [Validators.required, Validators.min(1)]],
//       numberOfQuestion: ['', [Validators.required, Validators.min(1)]]
//     });
//   }
//   // This need to be made with proper model
  
//   createQuiz() {
//     if (this.quizForm.invalid) return;

//     const dto: CreateQuizDTO = this.quizForm.value;

//     this.adminService.createQuiz(dto).subscribe({
//       next: (res) => {
//         alert('✅ Quiz created successfully!');
//         this.quizForm.reset();
//         // Navigate to view the created quiz or dashboard
//         this.router.navigate(['/admin/quiz/view', res.title]); // adjust this if needed
//       },
//       error: (err) =>
//         alert('❌ Error creating quiz: ' + (err?.error?.message || 'Server Error'))
//     });
//   }
