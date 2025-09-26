import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/tasks/components/create-task/create-task.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';
import { TaskDetailsComponent } from './features/tasks/components/task-details.component/task-details.component';
import { UserListComponent } from './features/users/components/user-list/user-list.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { authGuard } from './features/auth/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
    },
    {
        path: 'create',
        component: CreateTaskComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tasks',
        component: TaskListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'tasks/:id',
        component: TaskDetailsComponent,
        canActivate: [authGuard]
    },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [authGuard]
    },
    {
        path: 'login',
        component: LoginComponent
    }
];
