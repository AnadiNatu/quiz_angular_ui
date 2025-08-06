import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { LoginAuthRequest, UserRoles } from '../../models/dtos';
import { UserStorageService } from '../../services/user-storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 loginData: LoginAuthRequest = {
    username: '',
    password: ''
  };
  
  hovered: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private userStorage: UserStorageService
  ) {}

  onSubmit(): void {
    console.debug('[Login] Submitting login form:', this.loginData);
    this.isLoading = true;
    this.errorMessage = '';

    this.auth.login(this.loginData).subscribe({
      next: () => {
        const user = this.userStorage.getUser();
        const role = this.userStorage.getUserRole();

        console.debug('[Login] User fetched from storage:', user);
        console.debug('[Login] User Role:', role);

        switch (role) {
          case UserRoles.ADMIN:
            console.debug('[Login] Navigating to /admin');
            this.router.navigate(['/admin']);
            break;
          case UserRoles.PARTICIPANT:
            console.debug('[Login] Navigating to /participant');
            this.router.navigate(['/participant']);
            break;
          case UserRoles.CREATOR:
            console.debug('[Login] Navigating to /creator');
            this.router.navigate(['/creator']);
            break;
          default:
            this.errorMessage = 'Unknown role detected. Redirect failed.';
            console.error('[Login] Unknown role:', role);
        }
      },
      error: err => {
        this.errorMessage = 'Login Failed: ' + (err?.error || 'Unknown error occurred.');
        console.error('[Login] Error response:', err);
      },
      complete: () => {
        this.isLoading = false;
        console.debug('[Login] Request completed.');
      }
    });
  }
}

  // loginForm : FormGroup;
  // error: string = '';

  // constructor(private fb : FormBuilder , private authService : AuthService , private router : Router){
  //   this.loginForm = this.fb.group({
  //     username : ['' , Validators.required],
  //     password : ['' , Validators.required] 
  //   })
  // }

  // onSubmit() {
  //   if(this.loginForm.invalid) return;

  //   this.authService.login(this.loginForm).subscribe
  // }
