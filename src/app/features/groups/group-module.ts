import { NgModule } from '@angular/core';
import { GroupListComponent } from './components/group-list/group-list.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';
import { GroupUsersComponent } from './components/group-users/group-users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [GroupDetailsComponent, GroupListComponent, GroupUsersComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  exports: [GroupDetailsComponent, GroupListComponent, GroupUsersComponent],
})
export class GroupModule {}
