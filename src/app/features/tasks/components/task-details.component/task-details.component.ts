import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TASK_STATUSES, TASK_TYPES, UNASSIGNED } from '../../models/task.model';
import { AuthService } from '../../../auth/services/auth.service';
import { UserRole } from '../../../users/models/user.model';
import { Store } from '@ngrx/store';
import {
  selectisEditing,
  selectLoadingTask,
  selectSelectedTask,
  selectUpdatingTask,
} from '../../store/task.selectors';
import { loadTask, setEditMode, updateTask } from '../../store/tasks.actions';
import { UsersStore } from '../../../users/store/users.store';
import { GroupService } from '../../../groups/services/group.service';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: '../create-task/create-task.component.scss',
  standalone: false,
})
export class TaskDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  protected usersStore = inject(UsersStore);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private store = inject(Store);
  private groupService = inject(GroupService);

  isEditing = toSignal(this.store.select(selectisEditing));

  task = toSignal(this.store.select(selectSelectedTask));
  updating = toSignal(this.store.select(selectUpdatingTask));
  loading = toSignal(this.store.select(selectLoadingTask));
  groups = toSignal(this.groupService.getAllGroups(), { initialValue: [] });

  //taskFrom moved because of initilization order problem
  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    type: ['', Validators.required],
    status: ['', Validators.required],
    assignedTo: [UNASSIGNED, Validators.required],
    groupId: ['', Validators.required],
  });

  selectedGroupId = toSignal(
    this.taskForm.controls['groupId'].valueChanges,
    { initialValue: '' }
  );

  types = TASK_TYPES;
  statuses = TASK_STATUSES;

  taskId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  filteredUsers = computed(() => {
    const groupId = this.selectedGroupId();
    const groups = this.groups();

    const selectedGroup = groups?.find(g => g.id === groupId);
    if (!selectedGroup) {
      return this.usersStore.users();
    }

    return this.usersStore.getUsersByIds(selectedGroup.userIds);
  });

  constructor() {
    effect(() => {
      const id = this.taskId();
      if (id) {
        this.store.dispatch(loadTask({ id }));
      }
    });

    effect(() => {
      const fetchedTask = this.task();
      const currentUser = this.authService.currentUser();

      if (fetchedTask) {
        this.populateForm(fetchedTask);

        if (
          currentUser?.roles.includes(UserRole.MANAGER) &&
          !currentUser.roles.includes(UserRole.ADMIN)
        ) {
          this.taskForm.get('title')?.disable();
          this.taskForm.get('description')?.disable();
          this.taskForm.get('type')?.disable();
          this.taskForm.get('status')?.disable();
        }
      }
    });

    effect(() => {
      const users = this.filteredUsers();
      const currentAssignedTo = this.taskForm.get('assignedTo')?.value;

      if (
        currentAssignedTo &&
        currentAssignedTo !== UNASSIGNED &&
        !users.some(u => u.id === currentAssignedTo)
      ) {
        this.taskForm.patchValue({ assignedTo: UNASSIGNED });
      }
    });
  }

  canEdit(): boolean {
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      return false;
    }
    return (
      currentUser.roles.includes(UserRole.ADMIN) || currentUser.roles.includes(UserRole.MANAGER)
    );
  }

  onEditClick() {
    this.store.dispatch(setEditMode({ isEditing: true }));

    if (this.canEdit()) {
      this.usersStore.loadUsersIfNeeded();
    }
  }

  onSave() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const currentTask = this.task();
    if (!currentTask) {
      return;
    }
    
    const formValues = this.taskForm.getRawValue();
    
    const updatedTask: Task = { 
      ...currentTask, 
      title: formValues.title!,
      description: formValues.description || '',
      type: formValues.type as any,
      status: formValues.status as any,
      assignedTo: formValues.assignedTo!,
      groupId: formValues.groupId!
    };
    this.store.dispatch(updateTask({ task: updatedTask }));
  }

  onCancel() {
    const currentTask = this.task();
    if (currentTask) {
      this.populateForm(currentTask);
    }
    this.store.dispatch(setEditMode({ isEditing: false }));
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  populateForm(task: Task): void {
    this.taskForm.patchValue(task);
  }

  getGroupName(groupId: string): string {
    const group = this.groups()?.find(g => g.id === groupId);
    return group?.name || 'Unknown Group';
  }
}
