import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/tasks/components/create-task/create-task.component';
import { TaskListComponent } from './features/tasks/components/task-list/task-list.component';

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
    }
];
