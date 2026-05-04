// src/app/admin/models/admin-dtos.ts

// ─── Question DTOs ───────────────────────────────────────────────

export interface CreateQuestionDTO {
  questionTitle: string;
  category: string;
  difficultyLevel: string;
  rightAnswer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface QuestionDTO {
  id: number;
  questionTitle: string;
  category: string;
  difficultyLevel: string;
  rightAnswer: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

export interface QuestionWrapper {
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
}

// Full question with id + rightAnswer — returned by quiz-service feign fetch
export interface QuestionResponseDTO {
  id: number;
  questionTitle: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  rightAnswer: string;
}

// ─── Quiz DTOs ───────────────────────────────────────────────────

// POST /api/quiz  body
export interface CreateQuizDTO {
  title: string;
  category: string;
  difficultyLevel: string;
  numberOfQuestions: number;
  createdByUserId: number;
}

// GET /api/quiz/{id}  response
export interface QuizDTO {
  id: number;
  title: string;
  category: string;
  difficultyLevel: string;
  createdByUserId: number;
  creatorUsername: string;
  questionIds: number[];
  participantIds: number[];
  participantUsernames: string[];
}

// ─── Submit / Response DTOs ──────────────────────────────────────

// One answer in the submit body
export interface ResponseDTO {
  questionId: number;
  selectedAnswer: string | null;
}

// POST /api/quiz/submit  body
export interface QuizSubmitRequest {
  quizId: number;
  userId: number;
  responses: ResponseDTO[];
}

// POST /api/quiz/submit  response
export interface ResultDTO {
  quizId: number;
  quizTitle: string;
  userId: number;
  username: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
}

// ─── Result / Stats DTOs ─────────────────────────────────────────

// GET /api/quiz/{quizId}/results  and  /api/quiz/results/user/{userId}
export interface QuizResultDTO {
  id: number;
  quizId: number;
  quizTitle: string;
  category: string;
  difficultyLevel: string;
  participantId: number;
  participantUsername: string;
  participantEmail: string;
  curatorId: number;
  curatorUsername: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  takenAt: string;
}

// GET /api/quiz/{quizId}/stats
export interface QuizStatsDTO {
  quizId: number;
  quizTitle: string;
  category: string;
  difficultyLevel: string;
  creatorUsername: string;
  totalParticipants: number;
  totalQuestions: number;
  averageScore: number;
  averagePercentage: number;
  highestPercentage: number;
  lowestPercentage: number;
  passCount: number;
  failCount: number;
  participantResults: QuizResultDTO[];
}

// ─── Legacy aliases kept for components not yet refactored ───────
/** @deprecated use QuizResultDTO */
export interface CreatedQuizDTO {
  title: string;
  category: string;
  difficultyLevel: string;
  creatorName: string;
  questionList: QuestionDTO[];
}

/** @deprecated use QuizResultDTO */
export interface CreatorUserDTO {
  creatorName: string;
  userRoles: string;
  questionTitleList: string[];
}