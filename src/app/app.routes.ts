import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/tasks/components/create-task/create-task.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';
import { TaskDetailsComponent } from './features/tasks/components/task-details.component/task-details.component';
import { UserListComponent } from './features/tasks/components/user-list/user-list.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/tasks',
        pathMatch: 'full'
    },
    {
        path: 'create',
        component: CreateTaskComponent
    },
    {
        path: 'tasks',
        component: TaskListComponent
    },
    {
        path: 'tasks/:id',
        component: TaskDetailsComponent
    },
    {
        path: 'users',
        component: UserListComponent
    }
];
