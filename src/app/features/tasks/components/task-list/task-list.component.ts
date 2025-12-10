import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../users/models/user.model';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import {
  selectAllTasks,
  selectDeletingTask,
  selectLoadingTasks,
  selectTasksError,
} from '../../store/task.selectors';
import { deleteTask, loadTasks } from '../../store/tasks.actions';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroupService } from '../../../groups/services/group.service';

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
  groupService = inject(GroupService);

  groups = toSignal(this.groupService.getAllGroups(), { initialValue: [] });

  tasks = toSignal(this.store.select(selectAllTasks), { initialValue: [] });
  loading = toSignal(this.store.select(selectLoadingTasks));
  error = toSignal(this.store.select(selectTasksError));
  deleting = toSignal(this.store.select(selectDeletingTask));

  constructor() {
    this.store.dispatch(loadTasks());
  }

  isAdmin(): boolean {
    return this.authService.currentUser()?.roles.includes(UserRole.ADMIN) ?? false;
  }

  deleteTask(taskId: string): void {
    this.store.dispatch(deleteTask({ id: taskId }));
  }

  getGroupName(groupId: string): string {
    const group = this.groups().find(g => g.id === groupId);
    return group?.name ?? 'Unknown Group';
  }
}
