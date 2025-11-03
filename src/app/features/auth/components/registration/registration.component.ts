import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  standalone: false,
})
export class RegistrationComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  registrationForm: FormGroup;
  registrationError = signal<string | null>(null);

  constructor() {
    this.registrationForm = this.fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
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

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword || !password.value || !confirmPassword.value) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onRegister(): void {
    this.registrationError.set(null);
    if (this.registrationForm.invalid) {
      this.registrationForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...registrationData } = this.registrationForm.value;

    this.authService.register(registrationData).subscribe({
      error: (err: HttpErrorResponse) => {
        if (err.status === 409) {
          this.registrationError.set('ERROR_USERNAME_EXISTS');
        } else if (err.status === 400) {
          this.registrationError.set('ERROR_REGISTRATION_INVALID');
        } else {
          this.registrationError.set('ERROR_GENERIC');
        }
      },
    });
  }
}
