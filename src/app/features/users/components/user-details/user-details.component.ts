import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ASSIGNABLE_ROLES, UserRole } from '../../models/user.model';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersStore } from '../../store/users.store';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  standalone: false,
})
export class UserDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userStore = inject(UsersStore);

  user = computed(() => this.userStore.selectedUser());
  isEditing = signal(false);
  selectedRoles = signal<UserRole[]>([]);
  userid = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));
  assignableRoles = ASSIGNABLE_ROLES;

  constructor() {
    effect(() => {
      const id = this.userid();
      if (id) {
        this.userStore.loadUser(id);
      }
    });

    effect(() => {
      const currentUser = this.user();
      if (currentUser) {
        this.selectedRoles.set([...currentUser.roles]);
      }
    });
  }

  isRoleSelected(role: UserRole): boolean {
    return this.selectedRoles().includes(role);
  }

  toggleRole(role: UserRole): void {
    if (role === UserRole.USER) return;

    if (this.selectedRoles().includes(role)) {
      this.selectedRoles.set(this.selectedRoles().filter(r => r !== role));
    } else {
      this.selectedRoles.set([...this.selectedRoles(), role]);
    }

    if (!this.selectedRoles().includes(UserRole.USER)) {
      this.selectedRoles.set([...this.selectedRoles(), UserRole.USER]);
    }
  }

  onEditClick(): void {
    this.isEditing.set(true);
  }

  onSave(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    this.userStore.updateUserRoles({
      username: currentUser.username,
      roles: this.selectedRoles(),
    });
    this.isEditing.set(false);
  }

  onCancel() {
    const currentUser = this.user();
    if (currentUser) {
      this.selectedRoles.set([...currentUser.roles]);
    }
    this.isEditing.set(false);
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }
}
