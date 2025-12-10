import { Component, computed, effect, inject, input } from '@angular/core';
import { GroupStore } from '../../store/group.store';
import { UsersStore } from '../../../users/store/users.store';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-group-users',
  templateUrl: './group-users.component.html',
  styleUrl: './group-users.component.scss',
  standalone: false,
})
export class GroupUsersComponent {
  groupId = input.required<string>();

  groupStore = inject(GroupStore);
  usersStore = inject(UsersStore);
  fb = inject(FormBuilder);

  selectedUsername = new FormControl('');

  availableUsers = computed(() => {
    const allUsers = this.usersStore.users();
    const assignedUserIds = this.groupStore.groupUserIds();
    return allUsers.filter(user => !assignedUserIds.includes(user.username));
  });

  loadGroupUsersEffect = effect(() => {
    const id = this.groupId();
    if (id) {
      this.usersStore.loadUsers();
      this.groupStore.loadGroupUsers(id);
    }
  });

  onAssignUser() {
    const username = this.selectedUsername.value;
    if (username && this.groupId()) {
      this.groupStore.assignUser({ groupId: this.groupId(), username });
      this.selectedUsername.reset();
    }
  }

  onRemoveUser(username: string) {
    if(this.groupId()) {
      this.groupStore.removeUser({ groupId: this.groupId(), username });
    }
  }
}
