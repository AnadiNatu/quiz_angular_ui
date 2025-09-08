import { Component } from '@angular/core';
import { SignUpRequest } from '../../models/dtos';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule , FormsModule , RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {

  signUpData : SignUpRequest = {
    name: '',
    username: '',
    password: '',
    age: 0,
    roleNumber: 0
  };

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(): void {
    console.log('Attempting signup with data:', this.signUpData);

    this.auth.signup(this.signUpData).subscribe({
      next: (res) => {
        console.log('Signup successful:', res);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Signup failed:', err);
        alert('Sign Up Failed: ' + (err?.error || 'Unknown error'));
      }
    });
  }
}
