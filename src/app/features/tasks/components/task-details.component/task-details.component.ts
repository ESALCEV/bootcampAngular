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
      const id = params.get('id');
      if(id){
        return this.taskService.getTaskbyId(id);
      }
      return EMPTY;
    })
  );
  
  goBack(): void {
    this.router.navigate(['/']);
  }
}
