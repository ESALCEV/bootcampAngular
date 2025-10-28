import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/tasks/components/create-task/create-task.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';
import { TaskDetailsComponent } from './features/tasks/components/task-details.component/task-details.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { authGuard } from './features/auth/guards/auth.guard';
import { RegistrationComponent } from './features/auth/components/registration/registration.component';
import { UserDetailsComponent } from './features/users/components/user-details/user-details.component';
import { adminGuard } from './features/auth/guards/admin.guard';
import { guestGuard } from './features/auth/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/tasks',
    pathMatch: 'full',
  },
  {
    path: 'create',
    component: CreateTaskComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'tasks',
    component: TaskListComponent,
    canActivate: [authGuard],
  },
  {
    path: 'tasks/:id',
    component: TaskDetailsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'users',
    component: UserListComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'users/:id',
    component: UserDetailsComponent,
    canActivate: [authGuard, adminGuard],
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard],
  },
  {
    path: 'register',
    component: RegistrationComponent,
    canActivate: [guestGuard],
  },
];
