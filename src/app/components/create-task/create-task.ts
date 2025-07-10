import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss'
})
export class CreateTask implements OnInit {
   // Declare a property to hold the form structure
  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      // [initialValue]
      title: [''],
      description : [''],
      type: [''],
      status: ['']
    });
  }

  onSubmit(): void{
    //Create a new constant variable named 'newTask' and tell
    //TypeScript that it MUST match the shape of the 'Task' interface.
    const newTask: Task = {

      //Map the values from the form to the properties of new object.
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      type: this.taskForm.value.type,
      status: this.taskForm.value.status,

      //Sets the createdOn prooperty automatically with new date object with current timestamp.
      createdOn: new Date()
    };
    console.log('New Task Created:', newTask);
  }
}
