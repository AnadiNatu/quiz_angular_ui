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
    name : '',
    username: '',
    password: '',
    age: 0,
    roleNumber:0
  }

  constructor(private auth : AuthService , private router : Router){}

  onSubmit() : void{
    this.auth.signup(this.signUpData).subscribe({
      next: () => this.router.navigate(['/login']),
      error: err => alert('Sign Up Failed : ' + err.error)
    });
  }
}
