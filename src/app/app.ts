import { Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TasksModule } from './features/tasks/tasks-module';
import { UsersModule } from './features/users/users-module';
import { AuthModule } from './features/auth/auth-module';
import { AuthService } from './features/auth/services/auth.service';
import { UserRole } from './features/users/models/user.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    TasksModule,
    CommonModule,
    UsersModule,
    AuthModule,
    TranslateModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'bootcamp';
  translate = inject(TranslateService);
  authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  UserRole = UserRole;

  constructor() {
    this.authService.initializeUser();
    this.translate.addLangs(['lv', 'en']);
    this.translate.setFallbackLang('en');

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('selectedLanguage') || 'en';
      this.translate.use(savedLang);
    } else {
      this.translate.use('en');
    }

    this.translate.onLangChange.subscribe(event => {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('selectedLanguage', event.lang);
      }
    });
  }
}
