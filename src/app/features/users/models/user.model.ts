export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  USER = 'USER',
}

export const ASSIGNABLE_ROLES = [
  { value: UserRole.MANAGER, viewValue: 'Manager' },
  { value: UserRole.USER, viewValue: 'User', disabled: true },
];

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: UserRole[];
}