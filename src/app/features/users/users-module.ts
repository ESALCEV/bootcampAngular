import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { UserListComponent } from './components/user-list/user-list.component';



@NgModule({
  declarations: [
    UserListComponent
  ],
  imports: [
    CommonModule,
    RouterLink
  ],
  exports: [
    UserListComponent
  ]
})
export class UsersModule { }
