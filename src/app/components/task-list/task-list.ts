import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Task } from '../../models/task.model';
import { RouterLink } from '@angular/router';
import { TaskService } from '../../services/task.service';


@Component({
  selector: 'app-task-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './task-list.html',
  styleUrl: './task-list.scss'
})
export class TaskList implements OnInit {
  taskList: Task[] = [];

  constructor(private taskService: TaskService){}

  ngOnInit(): void {
    // We call http.get() and tell it to expect an array of Tasks (Task[])
    // The path '/assets/tasks.json' points file
    // this.http.get<Task[]>('assets/tasks.json').subscribe((loadedTasks)=>{
    //   this.taskList = loadedTasks.map(task => ({
    //     ...task,
    //     createdOn: new Date(task.createdOn)
    //   }));
    this.taskService.getTasks().subscribe((loadedTasks) =>{
      this.taskList = loadedTasks;
    });
      

      console.log('Tasks loaded from JSON file: ', this.taskList)
    };

  addTaskToList(newTask: Task): void {
    // this.taskList.push(newTask);
    this.taskList = [newTask, ...this.taskList];
    console.log('Task recived by parent: ', this.taskList);
  }
  deleteTask(taskToDelete: Task): void {
    this.taskService.deleteTask(taskToDelete.id);
    this.taskList = this.taskList.filter(task => task.id !== taskToDelete.id);

    console.log('Task deleted: ', this.taskList);
  }
}
