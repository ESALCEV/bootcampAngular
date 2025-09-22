import { Component, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
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
  
  task = signal<Task | undefined>(undefined);

  taskForm: FormGroup;
  types = TASK_TYPES;
  statuses = TASK_STATUSES;

  taskId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')))
  );

  constructor() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: [UNASSIGNED, Validators.required],
    });
    effect(() => {
      const id = this.taskId();

      if (id) {
        this.taskService.getTaskbyId(id)
        .subscribe(fetchedTask => {
          this.task.set(fetchedTask);
          this.populateForm(fetchedTask);
        })
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
        this.task.set(updatedTask);
      },
      error: (err) => console.error('Error updating task:', err),
    });
  }

  onCancel() {
    const currentTask = this.task();
    if (currentTask) {
      this.populateForm(currentTask);
    }
    this.isEditing.set(false);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
  
  populateForm(task: Task): void {
    this.taskForm.patchValue(task);
  }
}