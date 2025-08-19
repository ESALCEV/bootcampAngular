import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/api/tasks`;

  constructor(private http: HttpClient){}

  public getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.apiUrl);
  }

  getTaskbyId(id: string): Observable<Task>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Task>(url);
  }
  
  public addTask(newTask: Omit<Task, 'id' | 'createdOn'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, newTask);
  }

  public deleteTask(taskId: string): Observable<void>{
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(url);
  }

  updateTask(taskToUpdate: Task): Observable<Task> {
    const url = `${this.apiUrl}/${taskToUpdate.id}`;
    return this.http.put<Task>(url, taskToUpdate)
  }
}
