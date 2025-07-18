import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-create-task',
  //imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.scss',
  standalone: false
})
export class CreateTaskComponent {
  taskForm: FormGroup;
  statuses: string[] = ['To Do', 'In Progress', 'Done'];
  types: string[] = ['Bug', 'Feature', 'Chore'];
  taskCreated = false;

  constructor (private fb: FormBuilder, private taskService: TaskService){
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      type: ['', Validators.required],
      status: ['', Validators.required]
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

    onSubmit(): void {
      if (this.taskForm.invalid) {
        this.taskForm.markAllAsTouched();
        return;
      }
      const newTask: Task = {
        id: new Date().getTime(), // Use current timestamp as a unique ID
        title: this.taskForm.value.title,
        description: this.taskForm.value.description,
        status: this.taskForm.value.status,
        type: this.taskForm.value.type,
        createdOn: new Date()
      };
      this.taskService.addTask(newTask);
      this.taskForm.reset({
        type: '',
        status: ''
      });
      this.taskCreated = true;
      setTimeout(() => this.taskCreated = false, 3000);
  }
  

}
