import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';

@NgModule({
  declarations: [
    CreateTaskComponent,
    TaskListComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  exports: [
    CreateTaskComponent,
    TaskListComponent
  ]
})
export class TasksModule { }
