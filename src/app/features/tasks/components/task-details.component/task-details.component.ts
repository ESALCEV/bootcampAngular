import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { Observable, switchMap, map } from 'rxjs';
import { Task } from '../../models/task.model';


@Component({
  selector: 'app-task-details.component',
  templateUrl: './task-details.component.html',
  styleUrl: './task-details.component.scss',
  standalone: false
})
export class TaskDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  task$: Observable<Task | undefined>;

  constructor(){
    this.task$ = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.taskService.tasks$.pipe(
          map(tasks => tasks.find(task => task.id === id))
        );
      })
    );
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
