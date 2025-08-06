import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  CreateQuizDTO,
  CreatedQuizDTO,
  CreateQuestionDTO,
  CreatorUserDTO,
  QuestionWrapper,
  QuizTakenReponse,
  ResponseEvaluationDTO,
  ResultDTO,
  QuizDTO,
  QuestionDTO,
} from '../models/admin-dtos';

import { Observable } from 'rxjs';
import { UsersDTO } from '../../auth/models/dtos';
import { UserStorageService } from '../../auth/services/user-storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private BASE_URL = 'http://localhost:8080/api/admin/';
  
  constructor(private http : HttpClient , private storage : UserStorageService) { }

  addQuestion(dto : CreateQuestionDTO) : Observable<QuestionDTO>{
    return this.http.post<QuestionDTO>(`${this.BASE_URL}add` , dto , {
      headers : this.createAuthorizationHeader()
    });
  }

  createQuiz(dto : CreateQuizDTO) : Observable<QuizDTO>{
    return this.http.post<QuizDTO>(`${this.BASE_URL}create` , dto , {
      headers: this.createAuthorizationHeader()
    });
  }

  getCreatedQuiz(quizTitle : string) : Observable<CreatedQuizDTO> {
    return this.http.get<CreatedQuizDTO>(`${this.BASE_URL}created/${quizTitle}` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllQuestionsOfQuiz(quizTitle : string) : Observable<CreatorUserDTO>{
    return this.http.get<CreatorUserDTO>(`${this.BASE_URL}questions/${quizTitle}` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllQuizzesByCreator(): Observable<QuizDTO[]>{
    return this.http.get<QuizDTO[]>(`${this.BASE_URL}creator/all` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllQuiz() : Observable<QuizDTO[]> {
    return this.http.get<QuizDTO[]>(`${this.BASE_URL}quiz/all`, {
      headers : this.createAuthorizationHeader()
    })
  }

  getQuizForParticipant(quizTitle : string) : Observable<QuestionWrapper[]>{
    return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}participant/${quizTitle}` , {
      headers: this.createAuthorizationHeader()
    });
  } 

  submitQuizResponse(response : QuizTakenReponse) : Observable<ResponseEvaluationDTO[]>{
    return this.http.post<ResponseEvaluationDTO[]>(`${this.BASE_URL}responses/submit` , response , {
      headers: this.createAuthorizationHeader()
    });
  }

  getUserResult(quizTitle : string) : Observable<ResultDTO>{
    return this.http.get<ResultDTO>(`${this.BASE_URL}results/user/${quizTitle}` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllUserResults(quizTitle : string) : Observable<ResultDTO[]>{
    return this.http.get<ResultDTO[]>(`${this.BASE_URL}results/all/${quizTitle}` , {
      headers: this.createAuthorizationHeader()
    });
  }

  // -----------------------------------------------------------------
  getQuizByQuizTitle(title : string) : Observable<QuizDTO>{
    return this.http.get<QuizDTO>(`${this.BASE_URL}getQuiz/${title}` , {
      headers : this.createAuthorizationHeader()
    })
  }

  getAllQuizTitles() : Observable<string[]>{
    return this.http.get<string[]>(`${this.BASE_URL}getQuizTitles` , {
      headers : this.createAuthorizationHeader()
    })
  }

  getAllTakenQuizTitles() : Observable<any> {
    return this.http.get(`${this.BASE_URL}getTakenQuiz` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getQuestionCountByCategory(category : string) : Observable<number> {
    return this.http.get<number>(`${this.BASE_URL}count/category/${category}` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getQuestionCountByCategoryAndDifficulty(category : string , difficultyLevel : string) : Observable<number>{
    return this.http.get<number>(`${this.BASE_URL}count/category/${category}/difficulty/${difficultyLevel}` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}categories` , {
      headers: this.createAuthorizationHeader()
    });
  }

  getUserDetails() : Observable<UsersDTO>{
    return this.http.get<UsersDTO>(`${this.BASE_URL}user` , {
      headers: this.createAuthorizationHeader()
    });
  }
  
  private createAuthorizationHeader() : HttpHeaders{
    return new HttpHeaders().set(
      'Authorization' , 'Bearer ' + this.storage.getToken()
    )
  }
}
