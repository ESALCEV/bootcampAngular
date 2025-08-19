import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
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
}
