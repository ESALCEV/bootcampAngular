import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CreateTask } from "./components/create-task/create-task";
import { TaskList } from "./components/task-list/task-list";
import { Task } from './models/task.model';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateTask, TaskList, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected title = 'bootcamp';

  tasks: Task[] = [];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.http.get<Task[]>('assets/tasks.json').subscribe((loadedTasks) =>{
      this.tasks = loadedTasks;
      console.log('Tasks loaded from JSON:', this.tasks);
    });
  }

  onTaskAdded(newTask: Task): void{
    this.tasks.push(newTask);
    console.log('Task received by parent:', this.tasks);
  }
  deleteTask(taskToDelete: Task): void{
    this.tasks = this.tasks.filter(task => task.id !== taskToDelete.id);

    console.log('Tasks after deletion:', this.tasks);
  }
}
