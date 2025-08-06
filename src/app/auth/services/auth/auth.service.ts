import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SignUpRequest , UsersDTO , LoginAuthRequest , LoginAuthResponse , ForgotPasswordRequest , ResetPasswordRequest, UserRoles} from '../../models/dtos';
import { Observable , tap} from 'rxjs';
import { UserStorageService } from '../user-storage/user-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private BASE_URL = 'http://localhost:8080/api/auth';

  constructor(private http : HttpClient , private storage : UserStorageService) { }

  signup(data : SignUpRequest) : Observable<UsersDTO> {
    return this.http.post<UsersDTO>(`${this.BASE_URL}/signup` , data);
  }

  login(data : LoginAuthRequest) : Observable<LoginAuthResponse>{
    return  this.http.post<LoginAuthResponse>(`${this.BASE_URL}/login` , data).pipe(
      tap((response : LoginAuthResponse) => {
        this.storage.saveToken(response.jwt);
        this.storage.saveUser({
          id: response.id,
          name: '',
          username: data.username,
          password: '',
          age: 0,
          userRoles: response.userRoles
        });
      })
    );
  }

  forgotPassword(data : ForgotPasswordRequest) : Observable<string>{
    return this.http.post<string>(`${this.BASE_URL}/forgot-password` , data);
  }

  resetPassword(data : ResetPasswordRequest) : Observable<any> {
    return this.http.post(`${this.BASE_URL}/reset-password` , data);   
  }

  uploadProfilePhoto(username : string , file : File) : Observable<string>{
    const formData = new FormData();
    formData.append('file' , file);
    return this.http.post(`${this.BASE_URL}/username/upload-profile-photo` , formData , {
      responseType: 'text'
    });
  }

  getProfilePhoto(username : string) : Observable<Blob>{
    return this.http.get(`${this.BASE_URL}/${username}/profile-photo` , {
      responseType : 'blob'
    });
  }
  
  uploadProfilePicture(userId: number, file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);

  return this.http.post(`${this.BASE_URL}/upload-profile-picture/${userId}`, formData, {
    responseType: 'text'
  });
}
}

  // How to Use This in a Component
  // getUserProfilePhoto(userId: number): void {
//   this.authService.getProfilePhoto(userId).subscribe(photoBlob => {
//     const objectURL = URL.createObjectURL(photoBlob);
//     this.profileImageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
//   });
// }
// <img *ngIf="profileImageUrl" [src]="profileImageUrl" class="img-thumbnail" />
// ⚠️ You’ll need to inject DomSanitizer from @angular/platform-browser.

