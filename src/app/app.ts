import { Component, inject} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TasksModule } from './features/tasks/tasks-module';
import { UsersModule } from './features/users/users-module';
import { AuthModule } from './features/auth/auth-module';
import { AuthService } from './features/auth/services/auth.service';
import { UserRole } from './features/users/models/user.model';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TasksModule, CommonModule, UsersModule, AuthModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App{
  protected title = 'bootcamp';
  authService = inject(AuthService);

  UserRole = UserRole;

  constructor() {
      this.authService.initializeUser();
  }
}