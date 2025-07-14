import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from '../../models/task.model';
import { Output, EventEmitter } from '@angular/core';
import { TaskService } from '../../services/task.service';
import { Router } from '@angular/router';


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


  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      // [initialValue]
      title: ['', [Validators.required, Validators.minLength(3)]],
      description : [''],
      type: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  // Getter for the title form control
   get title() {
    return this.taskForm.get('title');
  }
  get type() {
    return this.taskForm.get('type');
  } 
  get status() {
    return this.taskForm.get('status');
  }

  onSubmit(): void{
    if(this.taskForm.invalid){
    // If it is, mark all fields as touched to trigger the error messages
      this.taskForm.markAllAsTouched();
      return;
    }
    // If the form is valid, create a new task object
    
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
    this.taskService.createTask(newTask);
    this.router.navigate(['/task-list']);
  }
}
