import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { switchMap, map } from 'rxjs';


@Component({
  selector: 'app-task-details.component',
  templateUrl: './task-details.component.html',
  standalone: false
})

export class TaskDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private taskService = inject(TaskService);

  task$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = Number(params.get('id'));
      return this.taskService.tasks$.pipe(
        map(tasks => tasks.find(task => task.id === id))
      );
    })
  );
  
  goBack(): void {
    this.router.navigate(['/']);
  }
}
