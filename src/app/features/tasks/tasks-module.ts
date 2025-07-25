import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailsComponent } from './components/task-details.component/task-details.component';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    CreateTaskComponent,
    TaskListComponent,
    TaskDetailsComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CreateTaskComponent,
    TaskListComponent,
    TaskDetailsComponent
  ]
})
export class TasksModule { }
