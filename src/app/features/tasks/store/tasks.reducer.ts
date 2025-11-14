import { createReducer, on } from '@ngrx/store';
import { Task } from '../models/task.model';
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
  setEditMode,
  updateTask,
  updateTaskFailure,
  updateTaskSuccess,
} from './tasks.actions';

export interface TaskState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  deleting: boolean;
  creating: boolean;
  updating: boolean;
  isEditing: boolean;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  deleting: false,
  creating: false,
  updating: false,
  isEditing: false,
};

export const taskReducer = createReducer(
  initialState,

  //Load tasks
  on(loadTasks, state => ({ ...state, loading: true })),
  on(loadTasksSuccess, (state, { tasks }) => ({ ...state, tasks, loading: false })),
  on(loadTasksFailure, (state, { error }) => ({ ...state, error, loading: false })),

  //Load single task
  on(loadTask, state => ({ ...state, loading: true, error: null })),
  on(loadTaskSuccess, (state, { task }) => ({ ...state, selectedTask: task, loading: false })),
  on(loadTaskFailure, (state, { error }) => ({ ...state, error, loading: false })),

  //Edit mode
  on(setEditMode, (state, { isEditing }) => ({ ...state, isEditing })),

  //Delete task
  on(deleteTask, state => ({ ...state, deleting: true, error: null })),
  on(deleteTaskSuccess, (state, { id }) => ({
    ...state,
    tasks: state.tasks.filter(task => task.id !== id),
    deleting: false,
    error: null,
  })),
  on(deleteTaskFailure, (state, { error }) => ({
    ...state,
    error,
    deleting: false,
  })),

  //Create task
  on(createTask, state => ({ ...state, creating: true, error: null })),
  on(createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: [...state.tasks, task],
    creating: false,
    error: null,
  })),
  on(createTaskFailure, (state, { error }) => ({
    ...state,
    error,
    creating: false,
  })),

  //Update task
  on(updateTask, state => ({ ...state, updating: true, error: null })),
  on(updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: state.tasks.map(t => (t.id === task.id ? task : t)),
    selectedTask: task,
    updating: false,
    error: null,
    isEditing: false,
  })),
  on(updateTaskFailure, (state, { error }) => ({
    ...state,
    error,
    updating: false,
  }))
);
