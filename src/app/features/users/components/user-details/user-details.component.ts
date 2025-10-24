import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../../users/services/user.service';
import { User, ASSIGNABLE_ROLES, UserRole } from '../../models/user.model';
import { EMPTY, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
  standalone: false
})
export class UserDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  user = signal<User | undefined>(undefined);
  isEditing = signal(false);
  selectedRoles = signal<UserRole[]>([]);
  errorMsg = signal<string | null>(null);
  
  assignableRoles = ASSIGNABLE_ROLES;

 constructor() {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (!id){
          this.errorMsg.set('No user ID provided');
          return EMPTY;
        } 
        this.errorMsg.set(null);
        return this.userService.getUserById(id);
      }),
      takeUntilDestroyed()
    ).subscribe({
      next: (user) => {
        this.user.set(user);
        this.errorMsg.set(null);
    },
    error: () => {
      this.errorMsg.set('Failed to load user details.');
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

    if(!this.selectedRoles().includes(UserRole.USER)) {
      this.selectedRoles.set([...this.selectedRoles(), UserRole.USER]);
    }
  }

  onEditClick(): void {
    this.isEditing.set(true);
  }
  
  onSave(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    this.userService.updateUserRoles(currentUser.username, this.selectedRoles())
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (updatedUser) => {
        this.user.set(updatedUser);
        this.isEditing.set(false);
        this.errorMsg.set(null);
      },
      error: () => {
        this.errorMsg.set('Failed to update user roles.');
      }
    });
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