import { Component, OnInit } from '@angular/core';
import { QuestionWrapper, QuizTakenReponse, ResponseDTO, ResponseEvaluationDTO, ResultDTO } from '../../models/admin-dtos';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AdminServiceService } from '../../services/admin-service.service';
import { AuthService } from '../../../auth/services/auth/auth.service';
import { UserStorageService } from '../../../auth/services/user-storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-participant-quiz',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule , FormsModule],
  templateUrl: './participant-quiz.component.html',
  styleUrl: './participant-quiz.component.css'
})
export class ParticipantQuizComponent implements OnInit {
  quizTitle = '';
  username = '';
  questions: QuestionWrapper[] = [];
  responseForm!: FormGroup;
  submitted = false;
  evaluations: ResponseEvaluationDTO[] = [];
  timer = 15;
  showTimer = false;
  timerInterval: any;
  resultSummary?: ResultDTO;

  showSearch = true;

  searchForm!: FormGroup;
  allQuizTitles: string[] = [];
  selectedQuizTitle = '';

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminServiceService,
    private userStorageService: UserStorageService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.userStorageService.getUser();
    if (!user) {
      console.error('No logged-in user found');
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;

    this.searchForm = this.fb.group({ searchQuiz: [''] });

    // Load available quizzes for dropdown
    this.adminService.getAllQuizTitles().subscribe({
      next: (titles) => this.allQuizTitles = titles,
      error: () => console.error('Failed to load quiz titles')
    });

    // If quizTitle is passed via route
    const paramTitle = this.route.snapshot.paramMap.get('quizTitle');
    if (paramTitle) {
      this.loadQuiz(paramTitle);
    }
  }

  onSearch(): void {
  const title = this.searchForm.value.searchQuiz?.trim();
  if (title) this.startQuizTimer(title);
}

onDropdownSelect(): void {
  if (this.selectedQuizTitle) {
    this.searchForm.patchValue({ searchQuiz: this.selectedQuizTitle });
    this.startQuizTimer(this.selectedQuizTitle);
  }
}

startQuizTimer(title: string): void {
  this.showTimer = true;
  this.timer = 15;

  if (this.timerInterval) clearInterval(this.timerInterval);

  this.timerInterval = setInterval(() => {
    this.timer--;
    if (this.timer <= 0) {
      clearInterval(this.timerInterval);
      this.showTimer = false;
      this.showSearch = false;
      this.loadQuiz(title);
    }
  }, 1000);
}

  loadQuiz(title: string): void {
    this.quizTitle = title;
    this.adminService.getQuizForParticipant(title).subscribe({
      next: (questions) => {
        this.questions = questions;
        this.submitted = false;
        this.evaluations = [];
        this.resultSummary = undefined;
        this.buildForm();
      },
      error: (err) => {
        console.error('Failed to load quiz', err);
        this.questions = [];
      }
    });
  }

  buildForm(): void {
    const group: { [key: string]: any } = {};
    this.questions.forEach(q => {
      group[q.questionTitle] = [null];
    });
    this.responseForm = this.fb.group(group);
  }

  submitQuiz(): void {
    const raw = this.responseForm.getRawValue();
    const responses: ResponseDTO[] = Object.entries(raw).map(([questionTitle, selectedAnswer]) => ({
      questionTitle,
      selectedAnswer: selectedAnswer as string ?? null
    }));

    const quizResponse: QuizTakenReponse = {
      quizTitle: this.quizTitle,
      userName: this.username,
      responseList: responses
    };

    this.adminService.submitQuizResponse(quizResponse).subscribe({
      next: (res) => {
        this.evaluations = res;
        this.submitted = true;
        this.resultSummary = undefined;
      },
      error: (err) => console.error('Submission failed', err)
    });
  }

  goToResult(): void {
      this.adminService.getUserResult(this.quizTitle).subscribe({
        next: (result) => this.resultSummary = result,
        error: (err) => console.error('Failed to fetch result summary', err)
      });
  }
}


// HEY CHAT MY THESE FUNCTIONALTIES ARE NOT WORKING IN THE "PARTICIPANT-QUIZ" THE QUIZ RESULTS MUST BE SHOWN AFTER THE USER HAS TAKEN THE QUIZ 
// THESE TWO FUNCTIONALITIES MUST BE SHOWN TO THE USER AFTER THE USER HAS TAKEN THE QUIZ
// SERVICES
//   1.) THIS SERVICE SHOULD BE TRIGGERED AFTER THE USER HAS CLICKED THE SUBMIT BUTTON . THIS SERVICE SHOWS THE SELECTED ANSWERS AND RIGHT ANSWER OF THE QUESTION . ADD CSS AND EDIT HTML TO SEE WHETHER THE ANSWER SELECTED IS RIGHT OR WRONG 
//   submitQuizResponse(response : QuizTakenReponse) : Observable<ResponseEvaluationDTO[]>{
//     return this.http.post<ResponseEvaluationDTO[]>(`${this.BASE_URL}responses/submit` , response , {
//       headers: this.createAuthorizationHeader()
//     });
//   }
// MODELS
// export interface QuizTakenReponse {
//     quizTitle : string;
//     userName : string;
//     responseList : ResponseDTO[];
// }

// export class ResponseDTO{
//     questionTitle : string;
//     selectedAnswer : string | null;
// }
// THE NEXT SERVICE THAT SHOULD BE TRIGGERED WHEN AFTER SEEING THE RESPONSE OF THE QUIZ THE USER WANTS TO SEE THE RESULT OF THE QUIZ TAKEN 
// SERVICES
//   1.) THIS SERVICE SHOULD BE TRIGGERED AFTER THE USER CLICKS VIEW RESULT AFTER THE RESPONSE
//   getUserResult(quizTitle : string) : Observable<ResultDTO>{
//     return this.http.get<ResultDTO>(`${this.BASE_URL}results/user/${quizTitle}` , {
//       headers: this.createAuthorizationHeader()
//     });
//   }
// MODELS
// export class ResultDTO{
//     quizId : number;
//     quizTitle : string;
//     userId : number;
//     userName : string;
//     totalQuestion : number;
//     correctAnswer : number;
//     incorrectAnswer : number;
//     percentage : number;
// } 

// AND ALSO REMOVE THE DROPDOWN AND SEARCH BAR AFTER THE QUIZ IS STARTED AFTER THE TIMER




// HEY CHAT CAN YOU ADD THIS FUNCTIONALITY TO SEE THE RESULT OF THE USER AFTER THE USER TAKES THE TEST 
//   getUserResult(quizTitle : string) : Observable<ResultDTO>{
//     return this.http.get<ResultDTO>(`${this.BASE_URL}results/user/${quizTitle}` , {
//       headers: this.createAuthorizationHeader()
//     });
//   }
// SO THAT THE USER CAN SEE THE RESULT OF HIS OR HER QUIZ ATTEMPT 
// export class ResultDTO{
//     quizId : number;
//     quizTitle : string;
//     userId : number;
//     userName : string;
//     totalQuestion : number;
//     correctAnswer : number;
//     incorrectAnswer : number;
//     percentage : number;
// }
// CAN YOU EDIT THE TS AND HTML FILES OF THE COMPONENT
// --->TS FILE
// --->HTML FILE

// NEED TO ADD THESE FUNCTIONALITIES TO THE COMPONENT SUCH THAT THE USER CAN SEARCH OR SEE WHAT QUIZ ARE AVAILBLE TO BE TAKEN USING THESE SERVICES
  // getQuizByQuizTitle(title : string) : Observable<QuizDTO>{
  //   return this.http.get<QuizDTO>(`${this.BASE_URL}getQuiz/${title}` , {
  //     headers : this.createAuthorizationHeader()
  //   })
  // }

  // getAllQuizTitles() : Observable<string[]>{
  //   return this.http.get<string[]>(`${this.BASE_URL}getQuizTitles` , {
  //     headers : this.createAuthorizationHeader()
  //   })
  // }
// AND ONCE THE QUIZ TITLE IS SELETED THIS SERVICE IS TRIGGERED 
  // getQuizForParticipant(quizTitle : string) : Observable<QuestionWrapper[]>{
  //   return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}participant/${quizTitle}` , {
  //     headers: this.createAuthorizationHeader()
  //   });
  // }
// SUCH THAT THE USER CAN TAKE THE QUIZ . THE RESPONSES OF WHICH ARE SENT TO THE BACKEND USING THIS SERVICE 
  // submitQuizResponse(response : QuizTakenReponse) : Observable<ResponseEvaluationDTO[]>{
  //   return this.http.post<ResponseEvaluationDTO[]>(`${this.BASE_URL}responses/submit` , response , {
  //     headers: this.createAuthorizationHeader()
  //   });
  // }
// AFTER WHICH THE USER SHOULD GET TO SEE THE RESULT USING THIS SERVICE TRIGGER
  // getUserResult(quizTitle : string) : Observable<ResultDTO>{
  //   return this.http.get<ResultDTO>(`${this.BASE_URL}results/user/${quizTitle}` , {
  //     headers: this.createAuthorizationHeader()
  //   });
  // }
// RELATED MODELS
// export interface QuestionWrapper{
//     questionTitle : string;
//     option1 : string;
//     option2 : string;
//     option3 : string;
//     option4 : string;
// }
// export class ResponseDTO{
//     questionTitle : string;
//     selectedAnswer : string | null;
// }

// export class ResponseEvaluationDTO{
//     questionTitle : string;
//     correctAnswer : string;
//     participantAnswer : string;
// }

// export class ResultDTO{
//     quizId : number;
//     quizTitle : string;
//     userId : number;
//     userName : string;
//     totalQuestion : number;
//     correctAnswer : number;
//     incorrectAnswer : number;
//     percentage : number;
// }