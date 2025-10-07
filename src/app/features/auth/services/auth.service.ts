import { ApplicationRef, inject, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../users/models/user.model';
import { first, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../users/services/user.service';
import { Router } from '@angular/router';

interface LoginResponse {
  token: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/auth`;
  private userService = inject(UserService);
  private http = inject(HttpClient);
  private router = inject(Router);
  private isBrowser: boolean;
  private appRef = inject(ApplicationRef);

  isLoggedIn = signal<boolean>(false);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (!this.isBrowser) return;
    const token = localStorage.getItem('token');
    
    if (token) {
      this.isLoggedIn.set(true);
      this.appRef.isStable.pipe(
        first(stable => stable === true))
        .subscribe(() => {
          this.initializeUser();
        });
    }
  }
  
  private initializeUser(): void{
    if(this.isLoggedIn()){
      const userId = this.getUserId();
      if (userId) {
        this.userService.getUserId(userId).subscribe({
          error: () =>this.logout()
        });
      } else {
        this.logout();
      }
    }
  }

  login(credentials: {username: string, password: string}): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('userId', response.user.username);
        localStorage.setItem('isLoggedIn', 'true')
        
        this.isLoggedIn.set(true);
        this.userService.currentUser.set(response.user);

        this.router.navigate(['/tasks']);
      })
    );
  }

  logout(): void {
    const token = this.getAuthToken();
    this.http.post(`${this.apiUrl}/logout`, { token }).subscribe({
      next: () => {
        this.clearStorage();
      },
      error: () => {
        this.clearStorage();
      }
    });
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('isLoggedIn');

    this.isLoggedIn.set(false);
    this.userService.currentUser.set(null);

    this.router.navigate(['/login']);
  }

  getUserId(): string | null {
    if(this.isBrowser){
      return localStorage.getItem('userId');
    }
    return null;
  }

  getAuthToken(): string | null {
    if(this.isBrowser) {
      return localStorage.getItem('token');
    }
    return null;
  }
}