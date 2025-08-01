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
  public addTask(newTask: Omit<Task, 'id' | 'createdOn'>): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, newTask).pipe(
      tap(savedTask => {
        const currentTasks = this.tasksSubject.getValue();
        this.tasksSubject.next([savedTask, ...currentTasks]);
      })
    )
  }

  public deleteTask(taskId: string): Observable<void>{
    const url = `${this.apiUrl}/${taskId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => {
        const currentTasks = this.tasksSubject.getValue();
        const updatedTasks = currentTasks.filter(task => task.id !== taskId);
        this.tasksSubject.next(updatedTasks);
        console.log(`Task with ID ${taskId} deleted successfully.`);
      })
    );
  }

  updateTask(taskToUpdate: Task): Observable<Task> {
    const url = `${this.apiUrl}/${taskToUpdate.id}`;
    return this.http.put<Task>(url, taskToUpdate).pipe(
      tap(updatedTaskFromServer => {
        const currentTasks = this.tasksSubject.getValue();
        const index = currentTasks.findIndex(task => task.id === updatedTaskFromServer.id);
        if (index !== -1) {
          currentTasks[index] = updatedTaskFromServer;
          this.tasksSubject.next([...currentTasks]);
        }
      })
    );
  }
}
