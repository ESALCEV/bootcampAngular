import { Component } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Observable } from 'rxjs';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: false
})
export class TaskListComponent {  
   tasks$: Observable<Task[]>

  constructor(private taskService: TaskService) {
     this.tasks$ = this.taskService.tasks$
  }

  deleteTask(taskToDelete: Task): void{
    this.taskService.deleteTask(taskToDelete)
  }
}
