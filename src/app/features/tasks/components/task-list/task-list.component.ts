import { Component, inject } from '@angular/core';
import { Task } from '../../models/task.model';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../users/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectAllTasks,
  selectDeletingTask,
  selectLoadingTasks,
  selectTasksError,
} from '../../store/task.selectors';
import { deleteTask, loadTasks } from '../../store/tasks.actions';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss',
  standalone: false,
})
export class TaskListComponent {
  private store = inject(Store);
  authService = inject(AuthService);
  translate = inject(TranslateService);

  tasks$: Observable<Task[]> = this.store.select(selectAllTasks);
  loading$ = this.store.select(selectLoadingTasks);
  error$ = this.store.select(selectTasksError);
  deleting$ = this.store.select(selectDeletingTask);

  constructor() {
    this.store.dispatch(loadTasks());
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.roles.includes(UserRole.ADMIN) ?? false;
  }

  deleteTask(taskId: string): void {
    this.store.dispatch(deleteTask({ id: taskId }));
  }
}
