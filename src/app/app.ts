import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './components/header/header';
import { Task } from './models/task.model';
import { CreateTask } from './components/create-task/create-task';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, CreateTask, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected title = 'bootcamp';
  taskList: Task[] = [];

  constructor(private http: HttpClient){}

  ngOnInit(): void {
    // We call http.get() and tell it to expect an array of Tasks (Task[])
    // The path '/assets/tasks.json' points file
    this.http.get<Task[]>('assets/tasks.json').subscribe((loadedTasks)=>{
      this.taskList = loadedTasks.map(task => ({
        ...task,
        createdOn: new Date(task.createdOn)
      }));

      console.log('Tasks loaded from JSON file: ', this.taskList)
    });

  }


  addTaskToList(newTask: Task): void {
    // this.taskList.push(newTask);
    this.taskList = [newTask, ...this.taskList];
    console.log('Task recived by parent: ', this.taskList);
  }
  deleteTask(taskToDelete: Task): void {
    this.taskList = this.taskList.filter(task => task.id !== taskToDelete.id);

    console.log('Task deleted: ', this.taskList);
  }
}
