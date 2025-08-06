import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResetPasswordRequest } from '../../models/dtos';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule , FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  email: string = '';
  token: string = '';
  newPassword: string = '';
  message: string = '';
  error: string = '';

  constructor(private auth : AuthService , private router : Router , private route : ActivatedRoute){}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      this.email = params['email'] || '';

      console.log('🛠️ ResetPasswordComponent initialized with token:', this.token, 'and email:', this.email);
    })
  }

  onSubmit(){
    const request : ResetPasswordRequest = {
      email : this.email,
      token : this.token,
      newPassword : this.newPassword
    };

    console.debug('🔐 Reset password request:', request);

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
// THE EMAIL ENTERED IN THE LOGIN IS NOT VISIBLE IN THE RESET COMPONENT

