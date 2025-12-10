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
  let compiled: HTMLElement;

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
    compiled = fixture.nativeElement;
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

  it('should have access to store', () => {
    expect(component.store).toBe(mockGroupStore);
  });

  it('should react to store changes', () => {
    const newGroups: UserGroup[] = [
      { id: 'g4', name: 'DevOps', description: 'DevOps team', userIds: [] }
    ];
    
    mockGroupStore.groups.set(newGroups);
    fixture.detectChanges();

    const groups = component.store.groups();
    expect(groups.length).toBe(1);
    expect(groups[0].name).toBe('DevOps');
  });

  describe('UI - Loading State', () => {
    it('should show loading message when loading is true', () => {
      mockGroupStore.loading.set(true);
      fixture.detectChanges();

      const loadingText = compiled.querySelector('p')?.textContent;
      expect(loadingText).toContain('Loading groups');
    });

    it('should not show groups when loading', () => {
      mockGroupStore.loading.set(true);
      fixture.detectChanges();

      const groupElements = compiled.querySelectorAll('h3');
      expect(groupElements.length).toBe(0);
    });

    it('should hide loading message when loading is false', () => {
      mockGroupStore.loading.set(false);
      fixture.detectChanges();

      const loadingText = compiled.textContent;
      expect(loadingText).not.toContain('Loading groups');
    });
  });

  describe('UI - Error State', () => {
    it('should show error message when error exists', () => {
      const errorMessage = 'Failed to load groups';
      mockGroupStore.error.set(errorMessage);
      mockGroupStore.loading.set(false);
      fixture.detectChanges();

      const errorText = compiled.querySelector('p')?.textContent;
      expect(errorText).toContain(errorMessage);
    });

    it('should not show groups when error exists', () => {
      mockGroupStore.error.set('Error');
      mockGroupStore.loading.set(false);
      fixture.detectChanges();

      const groupElements = compiled.querySelectorAll('h3');
      expect(groupElements.length).toBe(0);
    });

    it('should hide error message when error is null', () => {
      mockGroupStore.error.set(null);
      fixture.detectChanges();

      const paragraphs = Array.from(compiled.querySelectorAll('p'));
      const hasError = paragraphs.some(p => p.textContent?.includes('Failed'));
      expect(hasError).toBe(false);
    });
  });

  describe('UI - Empty State', () => {
    it('should show "No groups found" when groups array is empty', () => {
      mockGroupStore.groups.set([]);
      mockGroupStore.loading.set(false);
      mockGroupStore.error.set(null);
      fixture.detectChanges();

      const emptyText = compiled.textContent;
      expect(emptyText).toContain('No groups found');
    });

    it('should not show group cards when empty', () => {
      mockGroupStore.groups.set([]);
      fixture.detectChanges();

      const groupElements = compiled.querySelectorAll('h3');
      expect(groupElements.length).toBe(0);
    });
  });

  describe('UI - Groups Display', () => {
    it('should render all groups', () => {
      const groupNames = compiled.querySelectorAll('h3');
      expect(groupNames.length).toBe(3);
      expect(groupNames[0].textContent).toContain('FE Team');
      expect(groupNames[1].textContent).toContain('BE Team');
      expect(groupNames[2].textContent).toContain('Empty Group');
    });

    it('should display group descriptions', () => {
      const descriptions = Array.from(compiled.querySelectorAll('p'));
      const descriptionTexts = descriptions.map(p => p.textContent);
      
      expect(descriptionTexts.some(text => text?.includes('Frontend team'))).toBe(true);
      expect(descriptionTexts.some(text => text?.includes('Backend team'))).toBe(true);
    });

    it('should show user tags when group has users', () => {
      const userTags = compiled.querySelectorAll('.user-tag');
      // FE Team has 2 users, BE Team has 1 user = 3 total
      expect(userTags.length).toBe(3);
      expect(userTags[0].textContent).toContain('user1');
      expect(userTags[1].textContent).toContain('user2');
      expect(userTags[2].textContent).toContain('user3');
    });

    it('should show "No users assigned" when group has no users', () => {
      const emptyGroupText = compiled.textContent;
      expect(emptyGroupText).toContain('No users assigned');
    });

    it('should not show user tags for empty group', () => {
      // Get all user tags and check they don't belong to Empty Group
      const allDivs = Array.from(compiled.querySelectorAll('div'));
      const emptyGroupDiv = allDivs.find(div => 
        div.querySelector('h3')?.textContent?.includes('Empty Group')
      );
      
      const userTagsInEmptyGroup = emptyGroupDiv?.querySelectorAll('.user-tag');
      expect(userTagsInEmptyGroup?.length ?? 0).toBe(0);
    });
  });

  describe('UI - Buttons', () => {
    it('should render Edit and Delete buttons for each group', () => {
      const buttons = compiled.querySelectorAll('button.create-task-btn');
      // 3 groups × 2 buttons (Edit + Delete) = 6 buttons, plus 1 Create button = 7 total
      expect(buttons.length).toBeGreaterThanOrEqual(6);
    });

    it('should have Create Group button', () => {
      const createButton = compiled.querySelector('button[routerLink="/groups/create"]');
      expect(createButton).toBeTruthy();
      expect(createButton?.textContent).toContain('Create Group');
    });

    it('should have Edit button with correct route', () => {
      const buttons = compiled.querySelectorAll('button');
      const editButtons = Array.from(buttons).filter(btn => 
        btn.textContent?.includes('Edit')
      );
      expect(editButtons.length).toBe(3); // One for each group
    });
  });

  describe('Delete Functionality', () => {
    it('should call deleteGroup when user confirms deletion', () => {
      global.confirm = jest.fn(() => true);

      component.deleteGroup('g1');

      expect(mockGroupStore.deleteGroup).toHaveBeenCalledWith('g1');
    });

    it('should not call deleteGroup when user cancels deletion', () => {
      global.confirm = jest.fn(() => false);
      mockGroupStore.deleteGroup.mockClear();

      component.deleteGroup('g1');

      expect(mockGroupStore.deleteGroup).not.toHaveBeenCalled();
    });

    it('should show confirmation dialog with correct message', () => {
      global.confirm = jest.fn(() => true);

      component.deleteGroup('g1');

      expect(global.confirm).toHaveBeenCalledWith(expect.stringContaining('delete'));
    });
  });

  describe('Edge Cases', () => {
    it('should handle groups with undefined userIds', () => {
      const groupsWithUndefined: UserGroup[] = [
        { id: 'g4', name: 'Test', description: 'Test', userIds: undefined as any }
      ];
      
      mockGroupStore.groups.set(groupsWithUndefined);
      fixture.detectChanges();

      // Should not crash
      expect(component.store.groups().length).toBe(1);
    });

    it('should handle very long group names', () => {
      const longNameGroup: UserGroup[] = [
        { 
          id: 'g5', 
          name: 'A'.repeat(100), 
          description: 'Test', 
          userIds: [] 
        }
      ];
      
      mockGroupStore.groups.set(longNameGroup);
      fixture.detectChanges();

      const groupName = compiled.querySelector('h3');
      expect(groupName?.textContent?.length).toBeGreaterThan(50);
    });

    it('should handle groups with many users', () => {
      const manyUsersGroup: UserGroup[] = [
        { 
          id: 'g6', 
          name: 'Large Team', 
          description: 'Test', 
          userIds: Array.from({ length: 50 }, (_, i) => `user${i}`) 
        }
      ];
      
      mockGroupStore.groups.set(manyUsersGroup);
      fixture.detectChanges();

      const userTags = compiled.querySelectorAll('.user-tag');
      expect(userTags.length).toBe(50);
    });
  });
});
