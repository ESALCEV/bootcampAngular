import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: false
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registrationForm: FormGroup;
  registrationError = signal<string | null>(null);

  constructor() {
    this.registrationForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    }, {
      validators: this.passwordMatchValidator
    });
  }

  get username() {
    return this.registrationForm.get('username');
  }

  get password() {
    return this.registrationForm.get('password');
  }
  
  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get lastName() {
    return this.registrationForm.get('lastName');
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
      
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      delete confirmPassword.errors?.['passwordMismatch'];
      confirmPassword.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
    
    return null;
  }
  
  onRegister(): void{
    this.registrationError.set(null);
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...registrationData } = this.registrationForm.value;

    this.authService.register(registrationData).subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.registrationError.set('Username already exists. Please choose another.');
        } else if (err.status === 400) {
          this.registrationError.set('Invalid registration info');
        } else {
          this.registrationError.set('An error occurred. Please try again later.');
        }
      }
    });
  }
}
