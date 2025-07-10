export enum UserRoles {
    ADMIN = 'ADMIN', 
    PARTICIPANT = 'PARTICIPANT', 
    CREATOR = 'CREATOR'
}

export interface CreatedQuizDTO{
    title : string;
    category : string;
    difficultyLevel : string;
    creatorName : string;
    questionList : QuestionDTO[];
}

export interface CreateQuestionDTO{
    category : string;
    difficultyLevel : string;
    rightAnswer : string;
    questionTitle : string;
    option1 : string;
    option2 : string;
    option3 : string;
    option4 : string;
}

export interface CreateQuizDTO{
    quizTitle : string;
    category : string;
    difficultyLevel : string;
    noOfQuestion : number;
}

export interface CreatorUserDTO{
    creatorName : string;
    userRoles : UserRoles;
    questionTitleList : string[];
}

export class ParticipantUserDTO{
    participantName : string;
    userRoles : UserRoles;
    quizTitleList : string[];
}

export interface QuestionDTO{
    id: number;
    category: string;
    difficultyLevel: string;
    rightAnswer: string;
    questionTitle: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    quizId: number[];
}

export interface QuestionWrapper{
    questionTitle : string;
    option1 : string;
    option2 : string;
    option3 : string;
    option4 : string;
}

export interface QuizDTO{
    title : string;
    category : string;
    difficultyLevel : string;
    creatorUserId : number;
    creatorUserName : number;
    questionQuizIds : number[];
    participantUserName : string[];
}

export interface QuizTakenReponse {
    quizTitle : string;
    userName : string;
    responseList : ResponseDTO[];
}

export class ResponseDTO{
    questionTitle : string;
    selectedAnswer : string | null;
}

export class ResponseEvaluationDTO{
    questionTitle : string;
    correctAnswer : string;
    participantAnswer : string;
}

export class ResultDTO{
    quizId : number;
    quizTitle : string;
    userId : number;
    userName : string;
    totalQuestion : number;
    correctAnswer : number;
    incorrectAnswer : number;
    percentage : number;
}