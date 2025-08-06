export enum UserRoles {
    ADMIN = 0, 
    PARTICIPANT = 1, 
    CREATOR = 2
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