import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
  standalone: false
})
export class UserListComponent {
  private userService = inject(UserService);

  users$: Observable<User[]> = this.userService.users$;
  
}
