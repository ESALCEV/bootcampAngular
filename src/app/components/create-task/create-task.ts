import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './create-task.html',
  styleUrl: './create-task.scss'
})
export class CreateTask implements OnInit {
  @Output() taskCreated = new EventEmitter<Task>();

   // Declare a property to hold the form structure
  taskForm!: FormGroup;
  statuses: string[] = ['To Do', 'In Progress', 'Done'];
  types: string[] = ['Bug', 'Feature', 'Chore'];


  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      // [initialValue]
      title: ['', Validators.required],
      description : [''],
      type: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  onSubmit(): void{
    //Create a new constant variable named 'newTask' and tell
    //TypeScript that it MUST match the shape of the 'Task' interface.
    const newTask: Task = {

      //Map the values from the form to the properties of new object.
      id: new Date().getTime(), // Use current timestamp as a unique ID
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      type: this.taskForm.value.type,
      status: this.taskForm.value.status,

      //Sets the createdOn prooperty automatically with new date object with current timestamp.
      createdOn: new Date()
    };
    //now emit the event with the new task as the payload.
    this.taskCreated.emit(newTask);
    // Reset the form values to empty strings instead of null.
    this.taskForm.patchValue({
      title: '',
      description: '',
      type: '',
      status: ''
    });
  
    this.taskForm.markAsPristine();
    this.taskForm.markAsUntouched();
  }
}
