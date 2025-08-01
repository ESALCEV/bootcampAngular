import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/api/tasks';

  private tasksSubject = new BehaviorSubject<Task[]>([]);

  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private http: HttpClient){
    this.fetchTasks();
  }

  private fetchTasks(): void {
    this.http.get<Task[]>(this.apiUrl).subscribe(tasksFromApi => {
      this.tasksSubject.next(tasksFromApi);
    })
  }

  getTaskbyId(id: string): Observable<Task>{
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Task>(url);
  }

   public addTask(newTask: Task): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = [newTask, ...currentTasks];
    this.tasksSubject.next(updatedTasks);
  }

  public deleteTask(taskId: string): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    this.tasksSubject.next(updatedTasks);
  }
}
