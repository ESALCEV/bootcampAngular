import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreateTask } from "./components/create-task/create-task";
import { TaskList } from "./components/task-list/task-list";
import { Task } from './models/task.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CreateTask, TaskList],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'bootcamp';

  tasks: Task[] = [];

  onTaskAdded(newTask: Task): void{
    this.tasks.push(newTask);
    console.log('Task received by parent:', this.tasks);
  }
}
