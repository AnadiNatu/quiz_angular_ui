import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ForgotPasswordRequest } from '../../models/dtos';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

  email : string = '';
  message : string = '';
  error : string = '';

  constructor(private auth : AuthService){}

  onSubmit(){
    const request : ForgotPasswordRequest = { email : this.email};

    this.auth.forgotPassword(request).subscribe({
      next: (token) =>{
        this.message = 'Reset token to your email (or token : ' +token+ ')';
        this.error = '';
      },
      error: (err) => {
        this.error = err.error || 'Failed to send reset token';
        this.message = '';
      } 
    });
  }

}
