import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { TaskList } from '../task-list/task-list';
import { Task } from '../../models/task.model';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss'
})
export class CreateTask implements OnInit{
  @Output() taskCreated = new EventEmitter<Task>();

  taskForm!: FormGroup;
  statuses: string[] = ['To Do', 'In Progress', 'Done'];
  types: string[] = ['Bug', 'Feature', 'Chore'];

  constructor (private fb: FormBuilder){
  }
  ngOnInit(): void {
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
      this.taskCreated.emit(newTask);
      this.taskForm.reset();
  }

}
