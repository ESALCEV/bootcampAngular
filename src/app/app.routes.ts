import { Routes } from '@angular/router';
import { CreateTask } from './components/create-task/create-task';
import path from 'path';
import { Component } from '@angular/core';
import { TaskList } from './components/task-list/task-list';
import { TaskDetails } from './components/task-details/task-details';

export const routes: Routes = [
     {
    path: '',
    redirectTo: '/task-list',
    pathMatch: 'full'
  },
    {
        path: 'create-task',
        component: CreateTask,
    },
    { 
    path: 'task-list',
    component: TaskList
    },
    {
        path: 'task-list/:id', component: TaskDetails
    }
];
