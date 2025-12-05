import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { GroupListComponent } from './group-list.component';
import { GroupStore } from '../../store/group.store';
import { signal } from '@angular/core';
import { UserGroup } from '../../models/group.model';

describe('GroupListComponent', () => {
  let component: GroupListComponent;
  let fixture: ComponentFixture<GroupListComponent>;
  let mockGroupStore: any;

  const mockGroups: UserGroup[] = [
    { id: 'g1', name: 'FE Team', description: 'Frontend team', userIds: ['user1', 'user2'] },
    { id: 'g2', name: 'BE Team', description: 'Backend team', userIds: ['user3'] },
    { id: 'g3', name: 'Empty Group', description: 'No users', userIds: [] },
  ];

  beforeEach(async () => {
    mockGroupStore = {
      groups: signal(mockGroups),
      loading: signal(false),
      error: signal(null),
      loadGroups: jest.fn(),
      deleteGroup: jest.fn(),
    };

    await TestBed.configureTestingModule({
      declarations: [GroupListComponent],
      imports: [RouterModule.forRoot([])],
      providers: [
        { provide: GroupStore, useValue: mockGroupStore },
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load groups on init', () => {
    expect(mockGroupStore.loadGroups).toHaveBeenCalled();
  });

  it('should display groups from store', () => {
    const groups = component.store.groups();
    expect(groups.length).toBe(3);
    expect(groups[0].name).toBe('FE Team');
    expect(groups[1].name).toBe('BE Team');
  });

  it('should call deleteGroup when user confirms deletion', () => {
    // Mock window.confirm to return true
    global.confirm = jest.fn(() => true);

    component.deleteGroup('g1');

    expect(mockGroupStore.deleteGroup).toHaveBeenCalledWith('g1');
  });

  it('should handle empty groups list', () => {
    mockGroupStore.groups.set([]);
    fixture.detectChanges();

    const groups = component.store.groups();
    expect(groups.length).toBe(0);
  });
});
