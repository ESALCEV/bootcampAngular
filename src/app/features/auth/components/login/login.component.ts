import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: false
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm: FormGroup;
  loginError = signal<string | null>(null);

  constructor(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
  
  onLogin(): void{
    this.loginError.set('');
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    this.authService.login(this.loginForm.value).subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 401) {
          this.loginError.set('Invalid username or password');
        } else {
          this.loginError.set('An error occurred. Please try again later.');
        }
      }
    });
  }
}