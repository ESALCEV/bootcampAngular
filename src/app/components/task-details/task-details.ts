import { CommonModule  } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';

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
    private taskService: TaskService
  ){}

  ngOnInit(): void {
    const taskIdString = this.route.snapshot.paramMap.get('id');
    if(taskIdString){
      const taskId = Number(taskIdString);
      this.taskService.getTaskByID(taskId).subscribe((foundTask) => {
        this.task = foundTask;
      });
    }
  }
}
