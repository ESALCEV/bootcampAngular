import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState } from './tasks.reducer';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(selectTaskState, state => state.tasks);
export const selectSelectedTask = createSelector(selectTaskState, state => state.selectedTask);
export const selectUpdatingTask = createSelector(selectTaskState, state => state.updating);
export const selectLoadingTasks = createSelector(selectTaskState, state => state.loading);
export const selectTasksError = createSelector(selectTaskState, state => state.error);
export const selectDeletingTask = createSelector(selectTaskState, state => state.deleting);
export const selectCreatingTask = createSelector(selectTaskState, state => state.creating);
