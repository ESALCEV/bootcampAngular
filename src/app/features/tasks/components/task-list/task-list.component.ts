import { Component, inject } from '@angular/core';
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
  private taskService = inject(TaskService);
  
  tasks$: Observable<Task[]> = this.taskService.tasks$;

  deleteTask(taskId: string): void{
    this.taskService.deleteTask(taskId).subscribe({})
  }
}
