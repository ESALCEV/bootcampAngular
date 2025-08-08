import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../users/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  private usersSubject = new BehaviorSubject<User[]>([]);
  public users$: Observable<User[]> = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  public loadUsers(): void {
    this.http.get<User[]>(this.apiUrl).subscribe(usersFromApi => {
      this.usersSubject.next(usersFromApi);
    });
  }

  public getUsers(): Observable<User[]>{
    return this.users$;
  }
}
