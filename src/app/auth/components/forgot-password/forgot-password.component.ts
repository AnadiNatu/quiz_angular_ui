import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ForgotPasswordRequest } from '../../models/dtos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {

   // Form input and messages
  userEmail: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService , private router : Router) {}

  onSendResetLink(): void {
    const payload: ForgotPasswordRequest = { email: this.userEmail };

    console.log('🔍 Sending forgot password request:', payload);
    debugger;

    this.authService.forgotPassword(payload).subscribe({
      next: (token) => {
        console.log('✅ Token received:', token);
        this.successMessage = `Reset token sent to your email (or token: ${token})`;
        this.errorMessage = '';
        this.router.navigate(['/reset-password'] , {
          queryParams : {token : token , email : this.userEmail}
        })
      },
      error: (err) => {
        console.error('❌ Error during forgot password:', err);
        this.errorMessage = err.error || 'Failed to send reset token.';
        this.successMessage = '';
      }
    });
  }
}
