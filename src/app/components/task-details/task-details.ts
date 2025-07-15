import { CommonModule  } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task.model';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-task-details',
  imports: [ CommonModule],
  templateUrl: './task-details.html',
  styleUrl: './task-details.scss'
})
export class TaskDetails {
  task?: Task;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ){}

  ngOnInit(): void {
    const taskIdString = this.route.snapshot.paramMap.get('id');

    const taskId = Number(taskIdString);

    this.http.get<Task[]>('assets/tasks.json').subscribe((allTasks) => {
      this.task = allTasks.find(task => task.id === taskId);
    });
  }
}
