import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TASK_STATUSES, TASK_TYPES, UNASSIGNED } from '../../models/task.model';
import { Store } from '@ngrx/store';
import { selectCreatingTask, selectTasksError } from '../../store/task.selectors';
import { createTask } from '../../store/tasks.actions';
import { UsersStore } from '../../../users/store/users.store';
import { toSignal } from '@angular/core/rxjs-interop';

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

  taskForm: FormGroup;

  statuses = TASK_STATUSES;
  types = TASK_TYPES;

  creating = toSignal(this.store.select(selectCreatingTask));
  error = toSignal(this.store.select(selectTasksError));

  constructor() {
    this.usersStore.loadUsersIfNeeded();

    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: [UNASSIGNED, Validators.required],
    });
  }

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

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const newTask: Omit<Task, 'id' | 'createdOn'> = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      status: this.taskForm.value.status,
      type: this.taskForm.value.type,
      assignedTo: this.taskForm.value.assignedTo,
    };

    this.store.dispatch(createTask({ task: newTask }));
  }
}
