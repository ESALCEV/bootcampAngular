import { Component, inject } from '@angular/core';
import { UsersStore } from '../../store/users.store';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: false,
})
export class UserListComponent {
  readonly usersStore = inject(UsersStore);

  constructor() {
    this.usersStore.loadUsers();
  }
}
