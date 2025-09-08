import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { HomeComponent } from './auth/components/home/home.component';
import { LoginComponent } from './auth/components/login/login.component';
import { SignupComponent } from './auth/components/signup/signup.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/components/reset-password/reset-password.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule, 
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'angular-frontend-quiz_application';

  backgroundImages : string[] =[
    'assets/images/quiz_background_1.jpg',
    'assets/images/quiz_background_2.jpg',
    'assets/images/quiz_background_3.jpg',
    'assets/images/quiz_background_4.jpg'
  ]
  currentBackground : string = this.backgroundImages[0];
  private index = 0;

  ngOnInit(): void {
    setInterval(() => {
      this.index = (this.index + 1) % this.backgroundImages.length;
      this.currentBackground = this.backgroundImages[this.index];
    } , 3000);
  }
}
