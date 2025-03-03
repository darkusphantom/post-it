import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userEmail = 'test@test.com'
  private userPassword = 'Pokemon22*'
  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    if (email === this.userEmail && password === this.userPassword) {
      this.router.navigate(['/dashboard']);
      return true;
    } else {
      return false;
    }
  }
}
