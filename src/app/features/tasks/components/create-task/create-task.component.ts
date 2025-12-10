import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Task, TASK_STATUSES, TASK_TYPES, TaskStatus, TaskType, UNASSIGNED } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { selectCreatingTask, selectTasksError } from '../../store/task.selectors';
import { createTask } from '../../store/tasks.actions';
import { UsersStore } from '../../../users/store/users.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroupService } from '../../../groups/services/group.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
  standalone: false,
})
export class CreateTaskComponent {
  protected usersStore = inject(UsersStore);
  private store = inject(Store);
  private fb = inject(FormBuilder);
  private groupService = inject(GroupService);

  userGroups = toSignal(this.groupService.getAllGroups());

  taskForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    type: ['', Validators.required],
    status: ['', Validators.required],
    assignedTo: [UNASSIGNED, Validators.required],
    groupId: ['', Validators.required],
  });

  selectedGroupId = toSignal(this.taskForm.controls['groupId'].valueChanges, { initialValue: '' });

  statuses = TASK_STATUSES;
  types = TASK_TYPES;

  creating = toSignal(this.store.select(selectCreatingTask));
  error = toSignal(this.store.select(selectTasksError));

  constructor() {
    this.usersStore.loadUsersIfNeeded();
  }

  filteredUsers = computed(() => {
    const groupId = this.selectedGroupId();
    const groups = this.userGroups();

    const selectedGroup = groups?.find(g => g.id === groupId);
    if (!selectedGroup) {
      return this.usersStore.users();
    }

    return this.usersStore.getUsersByIds(selectedGroup.userIds);
  });

  get title() {
    return this.taskForm.get('title');
  }

  get type() {
    return this.taskForm.get('type');
  }

  get status() {
    return this.taskForm.get('status');
  }

  get assignedTo() {
    return this.taskForm.get('assignedTo');
  }

  get groupId() {
    return this.taskForm.get('groupId');
  }

  getUserGroups() {
    return this.userGroups();
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdOn'> = {
      title: this.taskForm.value.title ?? '',
      description: this.taskForm.value.description ?? '',
      status: this.taskForm.value.status as TaskStatus,
      type: this.taskForm.value.type as TaskType,
      assignedTo: this.taskForm.value.assignedTo ?? UNASSIGNED,
      groupId: this.taskForm.value.groupId ?? '',
    };

    this.store.dispatch(createTask({ task: newTask }));
  }
}
