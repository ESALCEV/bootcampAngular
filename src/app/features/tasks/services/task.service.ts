import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksSubject = new BehaviorSubject<Task[]>([]);

  public tasks$: Observable<Task[]> = this.tasksSubject.asObservable();

  constructor(private http: HttpClient){
    this.loadInitialTasks();
  }

  private loadInitialTasks(): void {
    this.http.get<Task[]>('assets/tasks.json').pipe(take(1)).subscribe(initialTasks => {
      this.tasksSubject.next(initialTasks);
    });
  }

   public addTask(newTask: Task): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = [newTask, ...currentTasks];
    this.tasksSubject.next(updatedTasks);
  }

  public deleteTask(taskId: number): void {
    const currentTasks = this.tasksSubject.getValue();
    const updatedTasks = currentTasks.filter(task => task.id !== taskId);
    this.tasksSubject.next(updatedTasks);
  }
}
