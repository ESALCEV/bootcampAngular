import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const authToken = authService.getAuthToken();

  if(authToken) {
    const authReq = req.clone ({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq).pipe(
      catchError((err: HttpErrorResponse) =>{
        if(err.status === 401 && !req.url.includes('/logout')) {
          alert('Your session has expired. Please login again.');
          authService.logout();
        }
        return throwError(() => err);
      })
    );
  }
  return next(req);
};