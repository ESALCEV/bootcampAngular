export const UNASSIGNED = 'UNASSIGNED';

export enum TaskType {
  BUG = 'BUG',
  FEATURE = 'FEATURE',
  CHORE = 'CHORE',
}

export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export const TASK_TYPES = [
  { value: TaskType.BUG, viewValue: 'Bug' },
  { value: TaskType.FEATURE, viewValue: 'Feature' },
  { value: TaskType.CHORE, viewValue: 'Chore' },
];

export const TASK_STATUSES = [
  { value: TaskStatus.TO_DO, viewValue: 'To Do' },
  { value: TaskStatus.IN_PROGRESS, viewValue: 'In Progress' },
  { value: TaskStatus.DONE, viewValue: 'Done' },
];

export interface Task {
    id: string; //MongoDB ObjectId as string
    title: string;
    description: string;
    type: TaskType;
    status: TaskStatus;
    createdOn: Date;
    assignedTo: string;
}