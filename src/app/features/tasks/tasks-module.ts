import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateTaskComponent } from './components/create-task/create-task.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskDetailsComponent } from './components/task-details.component/task-details.component';
import { RouterModule } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';


@NgModule({
  declarations: [
    CreateTaskComponent,
    TaskListComponent,
    TaskDetailsComponent,
    UserListComponent
  ],
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [
    CreateTaskComponent,
    TaskListComponent,
    TaskDetailsComponent,
    UserListComponent
  ]
})
export class TasksModule { }
