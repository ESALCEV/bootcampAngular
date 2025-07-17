import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor (private fb: FormBuilder, private taskService: TaskService){
    this.taskForm = this.fb.group({
      title: [''],
      description: [''],
      type: [''],
      status: ['']
    });
  }
  
    onSubmit(): void {
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
  }

}
