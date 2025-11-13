import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { TaskService } from '../services/task.service';
import {
  createTask,
  createTaskFailure,
  createTaskSuccess,
  deleteTask,
  deleteTaskFailure,
  deleteTaskSuccess,
  loadTask,
  loadTaskFailure,
  loadTasks,
  loadTasksFailure,
  loadTasksSuccess,
  loadTaskSuccess,
  updateTask,
  updateTaskFailure,
  updateTaskSuccess,
} from './tasks.actions';
import { Router } from '@angular/router';

@Injectable()
export class TasksEffects {
  private actions$ = inject(Actions);
  private taskService = inject(TaskService);
  private router = inject(Router);

  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTasks),
      switchMap(() =>
        this.taskService.getTasks().pipe(
          map(tasks => loadTasksSuccess({ tasks })),
          catchError(error => of(loadTasksFailure({ error: error.message })))
        )
      )
    )
  );

  loadTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTask),
      switchMap(({ id }) =>
        this.taskService.getTaskbyId(id).pipe(
          map(task => loadTaskSuccess({ task })),
          catchError(error => of(loadTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTask),
      switchMap(({ id }) =>
        this.taskService.deleteTask(id).pipe(
          map(() => deleteTaskSuccess({ id })),
          catchError(error => of(deleteTaskFailure({ error: error.message })))
        )
      )
    )
  );

  deleteTaskSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteTaskSuccess),
      map(() => loadTasks())
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createTask),
      switchMap(({ task }) =>
        this.taskService.addTask(task).pipe(
          map(createTask => createTaskSuccess({ task: createTask })),
          catchError(error => of(createTaskFailure({ error: error.message })))
        )
      )
    )
  );

  createTaskSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createTaskSuccess),
        tap(() => this.router.navigate(['/tasks']))
      ),
    { dispatch: false }
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateTask),
      switchMap(({ task }) =>
        this.taskService.updateTask(task).pipe(
          map(updatedTask => updateTaskSuccess({ task: updatedTask })),
          catchError(error => of(updateTaskFailure({ error: error.message })))
        )
      )
    )
  );
}
