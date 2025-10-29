import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './components/registration/registration.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LoginComponent, RegistrationComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslateModule],
  exports: [LoginComponent, RegistrationComponent],
})
export class AuthModule {}
