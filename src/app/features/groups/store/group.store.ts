import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { UserGroup } from '../models/group.model';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../services/group.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';

interface GroupState {
  groups: UserGroup[];
  selectedGroup: UserGroup | null;
  loading: boolean;
  error: string | null;
  groupUserIds: string[];
  loadingUsers: boolean;
}

const initialState: GroupState = {
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,
  groupUserIds: [],
  loadingUsers: false,
};

export const GroupStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withMethods((store, groupService = inject(GroupService), router = inject(Router)) => ({
    loadGroups: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          groupService.getAllGroups().pipe(
            tap({
              next: groups => {
                patchState(store, { groups, loading: false });
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

    clearSelectedGroup() {
      patchState(store, { selectedGroup: null });
    },

    loadGroupById: rxMethod<string>(
      pipe(
        tap(() => {
          patchState(store, { error: null, loading: true });
        }),
        switchMap(id =>
          groupService.getGroupById(id).pipe(
            tap({
              next: group => {
                patchState(store, { selectedGroup: group, loading: false });
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

    updateGroup: rxMethod<UserGroup>(
      pipe(
        tap(() => {
          patchState(store, { error: null, loading: true });
        }),
        switchMap(group =>
          groupService.updateGroup(group).pipe(
            tap({
              next: updatedGroup => {
                const updatedGroups = store
                  .groups()
                  .map(g => (g.id === updatedGroup.id ? updatedGroup : g));

                patchState(store, {
                  groups: updatedGroups,
                  selectedGroup: updatedGroup,
                  loading: false,
                });
                router.navigate(['/groups']);
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

    createGroup: rxMethod<UserGroup>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(group =>
          groupService.createGroup(group).pipe(
            tap({
              next: createdGroup => {
                patchState(store, state => ({
                  groups: [...state.groups, createdGroup],
                  loading: false,
                }));
                router.navigate(['/groups']);
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

    deleteGroup: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(id =>
          groupService.deleteGroup(id).pipe(
            tap({
              next: () =>
                patchState(store, {
                  groups: store.groups().filter(gr => gr.id !== id),
                  loading: false,
                }),
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loading: false });
              return EMPTY;
            })
          )
        )
      )
    ),

    loadGroupUsers: rxMethod<string>(
      pipe(
        tap(() => patchState(store, { loadingUsers: true, error: null })),
        switchMap(groupId =>
          groupService.getGroupUsers(groupId).pipe(
            tap({
              next: userIds => {
                patchState(store, { groupUserIds: userIds, loadingUsers: false });
              },
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loadingUsers: false });
              return EMPTY;
            })
          )
        )
      )
    ),

    assignUser: rxMethod<{groupId: string, username: string}>(
      pipe(
        tap(() => patchState(store, { loadingUsers: true, error: null })),
        switchMap(({groupId, username}) =>
          groupService.assignUserToGroup(groupId, username).pipe(
            tap({
              next: updatedGroup => {
                patchState(store, { 
                  selectedGroup: updatedGroup,
                  groupUserIds: updatedGroup.userIds ?? [],
                  loadingUsers: false 
                });
              },
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loadingUsers: false });
              return EMPTY;
            })
          )
        )
      )
    ),

    removeUser: rxMethod<{groupId: string, username: string}>(
      pipe(
        tap(() => patchState(store, { loadingUsers: true, error: null })),
        switchMap(({groupId, username}) =>
          groupService.removeUserFromGroup(groupId, username).pipe(
            tap({
              next: () => {
                const updatedUserIds = store.groupUserIds().filter(id => id !== username);
                patchState(store, { 
                  selectedGroup: store.selectedGroup(),
                  groupUserIds: updatedUserIds,
                  loadingUsers: false 
                });
              },
            }),
            catchError((error: Error) => {
              patchState(store, { error: error.message, loadingUsers: false });
              return EMPTY;
            })
          )
        )
      )
    ),
  }))
);
