import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User, UserRole } from '../../users/models/user.model';

interface RawUser {
  username: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/api/users`;

  constructor(private http: HttpClient) {}

  public getUsers(): Observable<User[]>{
    return this.http.get<RawUser[]>(this.apiUrl).pipe(
      map(rawUsers => rawUsers.map(this.mapToUser)));
  }

  public getAssignableUsers(): Observable<User[]> {
    return this.http.get<RawUser[]>(`${this.apiUrl}/assignable`)
      .pipe(map(user => user.map(this.mapToUser)));
  }

  public getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`)
      .pipe(map(this.mapToUser));
  }

  public updateUserRoles(username: string, roles: UserRole[]): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${username}/roles`, { roles })
      .pipe(map(this.mapToUser));
  }

  private mapToUser(raw: RawUser): User {
    return {
      id: raw.username,
      username: raw.username,
      firstName: raw.firstName,
      lastName: raw.lastName,
      roles: raw.roles
    };
  }
}