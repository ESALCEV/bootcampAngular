import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Task } from './features/tasks/models/task.model';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { TasksModule } from './features/tasks/tasks-module';
import { TaskService } from './features/tasks/services/task.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TasksModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'bootcamp';
  tasks$: Observable<Task[]>;

  constructor(private taskService: TaskService) {
    this.tasks$ = this.taskService.tasks$
  }

  deleteTask(taskToDelete: Task): void{
    this.taskService.deleteTask(taskToDelete)
  }
}
