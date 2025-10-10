import { Injectable, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { User } from '../../users/models/user.model';

interface RawUser {
  username: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  currentUser = signal<User | null>(null);

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]>{
    return this.http.get<RawUser[]>(this.apiUrl).pipe(
      map(rawUsers =>
        rawUsers.map(rawUser => ({
          id: rawUser.username,
          username: rawUser.username,
          firstName: rawUser.firstName,
          lastName: rawUser.lastName
        }))
      )
    )
  }

  public getUserId(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`).pipe(
      tap(user => this.currentUser.set(user))
    );
  }
}