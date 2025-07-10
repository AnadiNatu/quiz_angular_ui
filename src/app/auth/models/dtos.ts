export enum UserRoles {
    ADMIN = 'ADMIN', 
    PARTICIPANT = 'PARTICIPANT', 
    CREATOR = 'CREATOR'
}

export interface SignUpRequest {
    name : string;
    username: string;
    password: string;
    age: number;
    roleNumber: number;
}

export interface UsersDTO {
    id: number;
    name: string;
    username: string;
    password: string;
    age: number;
    userRoles: UserRoles;
}

export interface LoginAuthRequest {
  username: string;
  password: string;
}

export interface LoginAuthResponse {
  id: number;
  jwt: string;
  userRoles: UserRoles;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}