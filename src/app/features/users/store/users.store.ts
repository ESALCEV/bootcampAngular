import { User, UserRole } from '../models/user.model';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { UserService } from '../services/user.service';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { inject } from '@angular/core';

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  updating: boolean;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  isEditing: false,
  updating: false,
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
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),

    loadUsersIfNeeded() {
      if (store.users().length === 0 && !store.loading()) {
        this.loadUsers();
      }
    },

    setEditMode(isEditing: boolean) {
      patchState(store, { isEditing });
    },

    loadUser: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { error: null, loading: true });
        }),
        switchMap(id =>
          userService.getUserById(id).pipe(
            tap({
              next: user => {
                patchState(store, { selectedUser: user, loading: false });
              },
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),

    updateUserRoles: rxMethod<{ username: string; roles: UserRole[] }>(
      pipe(
        tap(() => {
          patchState(store, { error: null, updating: true });
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
                  updating: false,
                  isEditing: false,
                });
              },
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, updating: false });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
