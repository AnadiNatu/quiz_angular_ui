import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { LoginAuthRequest, UserRoles } from '../../models/dtos';
import { UserStorageService } from '../../services/user-storage/user-storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginData : LoginAuthRequest = {username: '' , password: ''};

  constructor(private auth :AuthService , private router : Router , private userStorage : UserStorageService){}

  onSubmit() : void{
    this.auth.login(this.loginData).subscribe({
      next: () => {
        const user = this.userStorage.getUser();
        console.log('User after Login: ' , user)
        const role = this.userStorage.getUserRole(); 
        console.log('User Role: ' , role);        

         if (role === UserRoles.ADMIN) {
          this.router.navigate(['/admin']);
        } else if (role === UserRoles.PARTICIPANT) {
          this.router.navigate(['/participant']);
        }else if(role === UserRoles.CREATOR){
          this.router.navigate(['/creator']);
        } 
        else {
          alert('Unknown role detected. Redirect failed.');
        }
      },
      error: err => alert('Login Failed: ' + err.error)
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
