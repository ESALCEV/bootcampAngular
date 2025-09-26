import { ApplicationRef, inject, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { User } from '../../users/models/user.model';
import { first, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { UserService } from '../../users/services/user.service';
import { Router } from '@angular/router';

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

    if(this.isBrowser) {
      this.isLoggedIn.set(localStorage.getItem('isLoggedIn') === 'true');
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
      }
    }
  }

  login(credentials: {username: string, password: string}): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user =>{
        const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
        localStorage.setItem('auth', encodedCredentials);

        localStorage.setItem('userId', user.username);
        localStorage.setItem('isLoggedIn', 'true');

        this.isLoggedIn.set(true);
        this.userService.currentUser.set(user);

        this.router.navigate(['/tasks']);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('auth');
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
      return localStorage.getItem('auth');
    }
    return null;
  }
}