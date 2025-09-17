import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { switchMap, EMPTY, combineLatest } from 'rxjs';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { UserService } from '../../../users/services/user.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TASK_STATUSES, TASK_TYPES, UNASSIGNED } from '../../models/task.model';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrl: '../create-task/create-task.component.scss',
  standalone: false
})

export class TaskDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);
  private userService = inject(UserService);
  private fb = inject(FormBuilder);

  users = toSignal(this.userService.getUsers(), { initialValue: [] });
  isEditing = signal(false);

  refreshPage = signal(0);

  taskForm: FormGroup;
  types = TASK_TYPES;
  statuses = TASK_STATUSES;

  task = toSignal(
    combineLatest([
      this.route.paramMap,
      toObservable(this.refreshPage)
    ]).pipe(
      switchMap(([params]) => {
        const id = params.get('id');
        if (id) {
          return this.taskService.getTaskbyId(id);
        }
        return EMPTY;
      })
    )
  );

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: [UNASSIGNED, Validators.required],
    })
      effect(() => {
        const currentTask = this.task();
        if (currentTask && this.isEditing()) {
          this.taskForm.patchValue(currentTask);
        }
    });
  }

  onEditClick() {
    this.isEditing.set(true);
  }

  onSave() {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    const currentTask = this.task();
    if (!currentTask) return;

    const updatedTask: Task = { ...currentTask, ...this.taskForm.value };

    this.taskService.updateTask(updatedTask).subscribe({
      next: () => {
        this.isEditing.set(false);
        this.refreshPage.update(count => count + 1);
      },
      error: (err) => console.error('Error updating task:', err),
    });
  }

  onCancel() {
    this.isEditing.set(false);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}