import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { UserStorageService } from '../services/user-storage.service';

// @Injectable({ providedIn: 'root' })
// export class AuthGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(): boolean {
//     if (UserStorageService.getToken()) {
//       return true;
//     }
//     this.router.navigate(['/login']);
//     return false;
//   }
// }
// Created by using ng generate guard guards/auth
// Used for - Protect routes like /dashboard with login validation:

}
