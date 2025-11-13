import { User, UserRole } from '../models/user.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserService } from '../services/user.service';
import { pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const UsersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, userService = inject(UserService)) => ({
    loadUsers: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          userService.getUsers().pipe(
            tap({
              next: users => {
                patchState(store, { users, loading: false });
              },
              error: (error: Error) => {
                patchState(store, { error: error.message, loading: false });
              },
            })
          )
        )
      )
    ),

    loadUser: rxMethod<string>(
      pipe(
        tap(id => {
          patchState(store, { error: null });
        }),
        switchMap(id =>
          userService.getUserById(id).pipe(
            tap({
              next: user => {
                patchState(store, { selectedUser: user });
              },
              error: (error: Error) => {
                patchState(store, { error: error.message });
              },
            })
          )
        )
      )
    ),

    updateUserRoles: rxMethod<{ username: string; roles: UserRole[] }>(
      pipe(
        tap(() => {
          patchState(store, { error: null });
        }),
        switchMap(({ username, roles }) =>
          userService.updateUserRoles(username, roles).pipe(
            tap({
              next: updatedUser => {
                const updatedUsers = store
                  .users()
                  .map(u => (u.username === username ? updatedUser : u));

                patchState(store, {
                  users: updatedUsers,
                  selectedUser: updatedUser,
                });
              },
              error: (error: Error) => {
                patchState(store, {
                  error: error.message,
                });
              },
            })
          )
        )
      )
    ),
  }))
);
