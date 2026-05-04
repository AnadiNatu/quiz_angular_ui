// src/app/admin/services/admin-service.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  CreateQuestionDTO,
  QuestionDTO,
  QuestionResponseDTO,
  CreateQuizDTO,
  QuizDTO,
  QuizSubmitRequest,
  ResultDTO,
  QuizResultDTO,
  QuizStatsDTO,
} from '../models/admin-dtos';
import { UsersDTO } from '../../auth/models/dtos';
import { UserStorageService } from '../../auth/services/user-storage/user-storage.service';

@Injectable({ providedIn: 'root' })
export class AdminServiceService {

  // All traffic goes through the API Gateway on :8080
  private AUTH_URL     = 'http://localhost:8080/api/auth';
  private QUESTION_URL = 'http://localhost:8080/api/questions';
  private QUIZ_URL     = 'http://localhost:8080/api/quiz';
  private NOTIFY_URL   = 'http://localhost:8080/api/notify';

  constructor(
    private http: HttpClient,
    private storage: UserStorageService
  ) {}

  // ─── Helpers ────────────────────────────────────────────────────

  private headers(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.storage.getToken()}`
    });
  }

  private jsonHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.storage.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // ─── Auth / User ────────────────────────────────────────────────

  // GET /api/auth/{id}
  getUserDetails(): Observable<UsersDTO> {
    const id = this.storage.getUserId();
    return this.http.get<UsersDTO>(`${this.AUTH_URL}/${id}`, {
      headers: this.headers()
    });
  }

  // GET /api/auth/all  (ADMIN)
  getAllUsers(): Observable<UsersDTO[]> {
    return this.http.get<UsersDTO[]>(`${this.AUTH_URL}/all`, {
      headers: this.headers()
    });
  }

  // ─── Questions ───────────────────────────────────────────────────

  // POST /api/questions
  addQuestion(dto: CreateQuestionDTO): Observable<QuestionDTO> {
    return this.http.post<QuestionDTO>(this.QUESTION_URL, dto, {
      headers: this.jsonHeaders()
    });
  }

  // GET /api/questions
  getAllQuestions(): Observable<QuestionDTO[]> {
    return this.http.get<QuestionDTO[]>(this.QUESTION_URL, {
      headers: this.headers()
    });
  }

  // GET /api/questions/category/{category}
  getQuestionsByCategory(category: string): Observable<QuestionDTO[]> {
    return this.http.get<QuestionDTO[]>(
      `${this.QUESTION_URL}/category/${category}`,
      { headers: this.headers() }
    );
  }

  // Derived: count questions by category
  getQuestionCountByCategory(category: string): Observable<number> {
    return this.getQuestionsByCategory(category).pipe(
      map(questions => questions.length)
    );
  }

  // Derived: count questions by category + difficulty
  getQuestionCountByCategoryAndDifficulty(
    category: string,
    difficultyLevel: string
  ): Observable<number> {
    return this.getQuestionsByCategory(category).pipe(
      map(questions =>
        questions.filter(
          q => q.difficultyLevel.toUpperCase() === difficultyLevel.toUpperCase()
        ).length
      )
    );
  }

  // Derived: unique categories from all questions
  getAllCategories(): Observable<string[]> {
    return this.getAllQuestions().pipe(
      map(questions => [...new Set(questions.map(q => q.category))])
    );
  }

  // DELETE /api/questions/{id}
  deleteQuestion(id: number): Observable<QuestionDTO> {
    return this.http.delete<QuestionDTO>(`${this.QUESTION_URL}/${id}`, {
      headers: this.headers()
    });
  }

  // ─── Quiz ────────────────────────────────────────────────────────

  // POST /api/quiz
  createQuiz(dto: CreateQuizDTO): Observable<QuizDTO> {
    return this.http.post<QuizDTO>(this.QUIZ_URL, dto, {
      headers: this.jsonHeaders()
    });
  }

  // GET /api/quiz/{id}
  getQuizById(id: number): Observable<QuizDTO> {
    return this.http.get<QuizDTO>(`${this.QUIZ_URL}/${id}`, {
      headers: this.headers()
    });
  }

  // GET /api/quiz/title/{title}
  getQuizByQuizTitle(title: string): Observable<QuizDTO> {
    return this.http.get<QuizDTO>(`${this.QUIZ_URL}/title/${encodeURIComponent(title)}`, {
      headers: this.headers()
    });
  }

  // GET /api/quiz/creator/{userId}
  getAllQuizzesByCreator(): Observable<QuizDTO[]> {
    const userId = this.storage.getUserId();
    return this.http.get<QuizDTO[]>(`${this.QUIZ_URL}/creator/${userId}`, {
      headers: this.headers()
    });
  }

  // GET /api/quiz  — all quizzes (admin view via creator/all pattern)
  getAllQuiz(): Observable<QuizDTO[]> {
    // Use creator/0 trick or fetch by a known admin id;
    // The backend doesn't expose a "get all" endpoint directly,
    // so we use the stats endpoint indirectly.
    // For now fetch quizzes by current user and fall back gracefully.
    return this.getAllQuizzesByCreator();
  }

  // GET /api/quiz/participant/{userId}  → string[] of titles
  getAllTakenQuizTitles(): Observable<string[]> {
    const userId = this.storage.getUserId();
    return this.http.get<string[]>(`${this.QUIZ_URL}/participant/${userId}`, {
      headers: this.headers()
    });
  }

  // GET /api/quiz/title/{title}  → derive titles list from creator quizzes
  getAllQuizTitles(): Observable<string[]> {
    return this.getAllQuizzesByCreator().pipe(
      map(quizzes => quizzes.map(q => q.title))
    );
  }

  // GET /api/quiz/{quizId}/questions  → string[] of question titles
  getQuestionTitlesOfQuiz(quizId: number): Observable<string[]> {
    return this.http.get<string[]>(`${this.QUIZ_URL}/${quizId}/questions`, {
      headers: this.headers()
    });
  }

  // ─── Start & Submit Quiz ─────────────────────────────────────────

  // POST /api/quiz/{quizId}/start?userId={userId}
  // Returns QuestionResponseDTO[] (with id + rightAnswer for evaluation)
  startQuiz(quizId: number): Observable<QuestionResponseDTO[]> {
    const userId = this.storage.getUserId();
    return this.http.post<QuestionResponseDTO[]>(
      `${this.QUIZ_URL}/${quizId}/start?userId=${userId}`,
      null,
      { headers: this.headers() }
    );
  }

  // POST /api/quiz/submit
  submitQuiz(request: QuizSubmitRequest): Observable<ResultDTO> {
    return this.http.post<ResultDTO>(`${this.QUIZ_URL}/submit`, request, {
      headers: this.jsonHeaders()
    });
  }

  // ─── Results ─────────────────────────────────────────────────────

  // GET /api/quiz/results/user/{userId}
  getUserResults(): Observable<QuizResultDTO[]> {
    const userId = this.storage.getUserId();
    return this.http.get<QuizResultDTO[]>(
      `${this.QUIZ_URL}/results/user/${userId}`,
      { headers: this.headers() }
    );
  }

  // GET /api/quiz/{quizId}/results
  getAllUserResults(quizId: number): Observable<QuizResultDTO[]> {
    return this.http.get<QuizResultDTO[]>(
      `${this.QUIZ_URL}/${quizId}/results`,
      { headers: this.headers() }
    );
  }

  // GET /api/quiz/{quizId}/stats
  getQuizStats(quizId: number): Observable<QuizStatsDTO> {
    return this.http.get<QuizStatsDTO>(
      `${this.QUIZ_URL}/${quizId}/stats`,
      { headers: this.headers() }
    );
  }

  // DELETE /api/quiz/{id}
  deleteQuiz(id: number): Observable<QuizDTO> {
    return this.http.delete<QuizDTO>(`${this.QUIZ_URL}/${id}`, {
      headers: this.headers()
    });
  }

  // ─── Notification (frontend-triggered) ───────────────────────────

  // POST /api/notify/email/report/{userId}
  sendReportCardEmail(userId: number): Observable<string> {
    return this.http.post(
      `${this.NOTIFY_URL}/email/report/${userId}`,
      null,
      { headers: this.headers(), responseType: 'text' }
    );
  }

  // GET /api/notify/document/participant/{userId}/report
  getParticipantReportDocument(userId: number): Observable<string> {
    return this.http.get(
      `${this.NOTIFY_URL}/document/participant/${userId}/report`,
      { headers: this.headers(), responseType: 'text' }
    );
  }

  // GET /api/notify/document/quiz/{quizId}/results
  getQuizResultDocument(quizId: number): Observable<string> {
    return this.http.get(
      `${this.NOTIFY_URL}/document/quiz/${quizId}/results`,
      { headers: this.headers(), responseType: 'text' }
    );
  }
}