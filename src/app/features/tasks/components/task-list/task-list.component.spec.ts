import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TaskListComponent } from './task-list.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserRole } from '../../../users/models/user.model';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import {
  selectAllTasks,
  selectDeletingTask,
  selectLoadingTasks,
  selectTasksError,
} from '../../store/task.selectors';
import { AuthService } from '../../../auth/services/auth.service';
import { GroupService } from '../../../groups/services/group.service';
import { RouterModule } from '@angular/router';
import { TasksModule } from '../../tasks-module';

describe('TaskListComponent', () => {
  let component: TaskListComponent;
  let fixture: ComponentFixture<TaskListComponent>;
  let mockGroupService: any;
  let store: MockStore;

  const mockUserAdmin = {
    id: 'admin1',
    username: 'admin1',
    roles: [UserRole.ADMIN],
    firstname: 'Admin',
    lastname: 'One',
  };

  const mockUserRegular = {
    id: 'user1',
    username: 'user1',
    roles: [UserRole.USER],
    firstname: 'User',
    lastname: 'One',
  };

  const mockGroups = [
    { id: 'g1', name: 'FE team', description: '', userIds: ['user1'] },
    { id: 'g2', name: 'BE team', description: '', userIds: ['admin1'] },
  ];

  const mockTasks = [
    { id: 't1', groupId: 'g1', title: 'FE task', description: 'desc 1', status: 'OPEN', type: 'BUG', assignedTo: 'user1', createdOn: new Date() },
    { id: 't2', groupId: 'g2', title: 'BE task', description: 'desc 2', status: 'IN_PROGRESS', type: 'FEATURE', assignedTo: 'admin1', createdOn: new Date() },
  ];

  beforeEach(async () => {
    mockGroupService = {
      getAllGroups: jest.fn().mockReturnValue(of(mockGroups)),
    };

    await TestBed.configureTestingModule({
      declarations: [TaskListComponent],
      imports: [TasksModule, TranslateModule.forRoot(), RouterModule.forRoot([])],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectAllTasks, value: [] },
            { selector: selectLoadingTasks, value: false },
            { selector: selectTasksError, value: null },
            { selector: selectDeletingTask, value: false },
          ],
        }),
        { provide: GroupService, useValue: mockGroupService },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskListComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tasks provided based on group', () => {
    const userTasks = [mockTasks[0]];
    store.overrideSelector(selectAllTasks, userTasks);
    store.refreshState();
    fixture.detectChanges();

    const visibleTasks = component.tasks();
    expect(visibleTasks.length).toBe(1);
    expect(visibleTasks[0].id).toBe('t1');
    expect(visibleTasks[0].groupId).toBe('g1');
  });


  it('should display all tasks', () => {
    store.overrideSelector(selectAllTasks, mockTasks);
    store.refreshState();
    fixture.detectChanges();

    const visibleTasks = component.tasks();
    expect(visibleTasks.length).toBe(2);
    expect(visibleTasks[0].id).toBe('t1');
    expect(visibleTasks[1].id).toBe('t2');
  });

  it('should resolve group names correctly', () => {
    expect(component.getGroupName('g1')).toBe('FE team');
    expect(component.getGroupName('g2')).toBe('BE team');
    expect(component.getGroupName('unknown')).toBe('Unknown Group');
  });

  it('should show empty state when user has no group tasks', () => {  
    store.overrideSelector(selectAllTasks, []);
    store.refreshState();
    fixture.detectChanges();

    const visibleTasks = component.tasks();
    const compiled = fixture.nativeElement;

    expect(compiled.textContent).toContain('NO_TASKS_ADDED');
    expect(visibleTasks.length).toBe(0);
  });
});
