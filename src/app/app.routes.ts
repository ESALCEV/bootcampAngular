import { Routes } from '@angular/router';
import { CreateTaskComponent } from './features/tasks/components/create-task/create-task.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: '/create',
        pathMatch: 'full'
    },
    {
        path: 'create',
        component: CreateTaskComponent
    }
];
