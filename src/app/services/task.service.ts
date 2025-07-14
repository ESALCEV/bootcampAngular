import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task.model';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasksUrl = 'assets/tasks.json';

  constructor(private http: HttpClient) {}

  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.tasksUrl);
  }

  getTaskByID(id:number): Observable<Task | undefined>{
    return this.getTasks().pipe(
      map(tasks => tasks.find(task => task.id === id))
    );
  }

  createTask(newTask: Task): void{
    console.log('TaskService: creating task..', newTask);
  }

  deleteTask(id: number): void{
    console.log(`TaskService: Deleting task id: ${id}` );
  }
}
