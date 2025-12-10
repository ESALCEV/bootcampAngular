import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserGroup } from '../models/group.model';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = `${environment.apiUrl}/api/groups`;

  constructor(private http: HttpClient) {}

  getAllGroups(): Observable<UserGroup[]> {
    return this.http.get<UserGroup[]>(this.apiUrl);
  }

  getGroupById(id: string): Observable<UserGroup> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<UserGroup>(url);
  }

  createGroup(newGroup: UserGroup): Observable<UserGroup> {
    return this.http.post<UserGroup>(this.apiUrl, newGroup);
  }

  deleteGroup(groupId: string): Observable<void> {
    const url = `${this.apiUrl}/${groupId}`;
    return this.http.delete<void>(url);
  }

  updateGroup(groupToUpdate: UserGroup): Observable<UserGroup> {
    const url = `${this.apiUrl}/${groupToUpdate.id}`;
    return this.http.put<UserGroup>(url, groupToUpdate);
  }

  assignUserToGroup(groupId: string, username: string): Observable<UserGroup> {
    const url = `${this.apiUrl}/${groupId}/users/${username}`;
    return this.http.post<UserGroup>(url, {});
  }

  removeUserFromGroup(groupId: string, username: string): Observable<void> {
    const url = `${this.apiUrl}/${groupId}/users/${username}`;
    return this.http.delete<void>(url);
  }

  getGroupUsers(groupId: string): Observable<string[]> {
    const url = `${this.apiUrl}/${groupId}/users`;
    return this.http.get<string[]>(url);
  }
}
