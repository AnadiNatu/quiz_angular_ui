import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  private BASE_URL = 'http://localhost:8080/auth/admin/';
  
  constructor(private http : HttpClient) { }

  // @PostMapping("/add")
// public ResponseEntity<QuestionDto> addQuestion(@RequestBody CreateQuestionDto dto) {
  addQuestion(dto : CreateQuestionDTO) : Observable<QuestionDTO>{
    return this.http.post<QuestionDTO>(`${this.BASE_URL}add` , dto);
  }

  createQuiz(dto : CreateQuizDTO) : Observable<QuizDTO>{
    return this.http.post<QuizDTO>(`${this.BASE_URL}created` , dto);
  }

  getCreatedQuiz(quizTitle : string) : Observable<CreatedQuizDTO> {
    return this.http.get<CreatedQuizDTO>(`${this.BASE_URL}created/${quizTitle}`);
  }

  getAllQuestionsOfQuiz(quizTitle : string) : Observable<CreatorUserDTO>{
    return this.http.get<CreatorUserDTO>(`${this.BASE_URL}/questions/${quizTitle}`);
  }

  getAllQuizzesByCreator(): Observable<QuizDTO[]>{
    return this.http.get<QuizDTO[]>(`${this.BASE_URL}creator/all`);
  }

  getQuizForParticipant(quizTitle : string) : Observable<QuestionWrapper[]>{
    return this.http.get<QuestionWrapper[]>(`${this.BASE_URL}participant/${quizTitle}`);
  } 

  submitQuizResponse(response : QuizTakenReponse) : Observable<ResponseEvaluationDTO[]>{
    return this.http.post<ResponseEvaluationDTO[]>(`${this.BASE_URL}responses/submit` , response);
  }

  getUserResult(quizTitle : string) : Observable<ResultDTO>{
    return this.http.get<ResultDTO>(`${this.BASE_URL}results/user/${quizTitle}`);
  }

  getAllUserResults(quizTitle : string) : Observable<ResultDTO[]>{
    return this.http.get<ResultDTO[]>(`${this.BASE_URL}results/all/${quizTitle}`);
  }

  getAllTakenQuizTitles() : Observable<any> {
    return this.http.get(`${this.BASE_URL}getTakenQuiz`);
  }
  
}
