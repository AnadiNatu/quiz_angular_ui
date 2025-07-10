import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ResetPasswordRequest } from '../../models/dtos';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(private auth : AuthService , private router : Router){}

  onSubmit(){
    const request : ResetPasswordRequest = {
      email : this.email,
      token : this.token,
      newPassword : this.newPassword
    };

    this.auth.resetPassword(request).subscribe({
      next: () => {
        this.message = 'Password reset successful . Redirecting to login';
        this.error = '';
        setTimeout(() => this.router.navigate(['/login']) , 2000);
      },
      error : (err) => {
        this.error = err.error || 'Password reset failed';
        this.message = '';
      }
    });
  }
}
