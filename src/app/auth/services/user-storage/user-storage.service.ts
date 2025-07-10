import { Injectable } from '@angular/core';
import { UserRoles , UsersDTO } from '../../models/dtos';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({
  providedIn: 'root'
})
export class UserStorageService {

  constructor() { }

  private user : {username : string} | null = null;

  saveToken(token : string) : void {
    localStorage.setItem(TOKEN_KEY , token);
  }

  getToken() : string | null{
    return localStorage.getItem(TOKEN_KEY);
  }

  saveUser(user : UsersDTO) : void {
    localStorage.setItem(USER_KEY , JSON.stringify(user));
  }

  getUser() : UsersDTO | null {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setUser(user : {username : string}){
    return this.user;
  }

  // getUserRole() : UserRoles | null {
  //   const user = this.getUser();
  //   return user ? user.userRoles : null;
  // }
  // Updated getUserRoles

    getUserRole(): UserRoles | null{
      const user = this.getUser();
      console.log("User : " +user);
      if(user && typeof user.userRoles === 'string'){
        return UserRoles[user.userRoles as keyof typeof UserRoles] ?? null;
      }
      return null;
    }

  isAdminLoggedIn() : boolean{
    return this.getToken() !== null && this.getUserRole() === UserRoles.ADMIN;
  }

  isCreatorLoggedId() : boolean{
    return this.getToken() !== null && this.getUserRole() === UserRoles.CREATOR;
  }
  
  isParticipantLoggedId() : boolean{
    return this.getToken() !== null && this.getUserRole() === UserRoles.PARTICIPANT;
  }

  getUserId() : number | null {
    const user = this.getUser();
    return user ? user.id : null;
  }

  getUserName() : string | null {
    const user = this.getUser();
    return user ? user.username : null
  }

  logout() : void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
}
