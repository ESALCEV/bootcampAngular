import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';
import { UserService } from '../../../users/services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-task',
  //imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
  standalone: false
})
export class CreateTaskComponent {
  taskForm: FormGroup;
  private userService = inject(UserService);
  users = toSignal(this.userService.getUsers(), { initialValue: [] });

  statuses = [
    { value: 'TO_DO', viewValue: 'To Do' },
    { value: 'IN_PROGRESS', viewValue: 'In Progress' },
    { value: 'DONE', viewValue: 'Done' }
  ];
  types = [
    { value: 'BUG', viewValue: 'Bug' },
    { value: 'FEATURE', viewValue: 'Feature' },
    { value: 'CHORE', viewValue: 'Chore' }
  ];

  constructor (
    private fb: FormBuilder, 
    private taskService: TaskService,
    private router: Router
  ){
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['UNASSIGNED', Validators.required]
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
  get assignedTo(){
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
        assignedTo: this.taskForm.value.assignedTo
      };

      this.taskService.addTask(newTask).subscribe({
        next: (task) => {
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
  }
}
