import { Component, computed, inject, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: false
})
export class UserListComponent {
  private userService = inject(UserService);

  private refreshTrigger = signal(0);

  usersResource = rxResource({
    params: () => this.refreshTrigger(),
    stream: () => this.userService.getUsers(),
    defaultValue: []
  });

  users = computed(() => this.usersResource.value());
  hasValue = computed(() => this.usersResource.hasValue());
  isLoading = computed(() => this.usersResource.status() === 'loading');
  hasError = computed(() => this.usersResource.status() === 'error');
}
