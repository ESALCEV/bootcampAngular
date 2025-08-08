import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchUsers();
  }

  private fetchUsers(): void{
    this.http.get<User[]>(this.apiUrl).subscribe({
      next: (users) => this.usersSubject.next(users),
      error: (error) => {
        console.error('Failed to fetch users', error);
        this.usersSubject.next([]);
      }
    });
  }
}
