import { Component, computed, inject, signal } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { rxResource } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../users/models/user.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: false,
})
export class TaskListComponent {
  private taskService = inject(TaskService);
  authService = inject(AuthService);
  translate = inject(TranslateService);

  private refreshTrigger = signal(0);

  isAdmin(): boolean {
    return this.authService.currentUser()?.roles.includes(UserRole.ADMIN) ?? false;
  }

  tasksResource = rxResource<Task[], number>({
    params: () => this.refreshTrigger(),
    stream: () => this.taskService.getTasks(),
    defaultValue: [],
  });

  tasks = computed(() => this.tasksResource.value());
  hasValue = computed(() => this.tasksResource.status());
  isLoading = computed(() => this.tasksResource.status() === 'loading');
  hasError = computed(() => this.tasksResource.status() === 'error');

  deleteTask(taskId: string): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.refreshTrigger.update(count => count + 1);
      },
      error(err) {
        console.error(`Failed to delete task ${taskId}`, err); // in real app would be err msg to user
      },
    });
  }
}
