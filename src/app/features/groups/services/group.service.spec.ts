import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { GroupService } from './group.service';
import { UserGroup } from '../models/group.model';
import { environment } from '../../../../environments/environment.development';
import { provideHttpClient } from '@angular/common/http';

describe('GroupService', () => {
  let service: GroupService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/api/groups`;

  const mockGroup: UserGroup = {
    id: 'g1',
    name: 'FE Team',
    description: 'Frontend developers',
    userIds: ['user1', 'user2']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GroupService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(GroupService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllGroups', () => {
    it('should fetch all groups', () => {
      const mockGroups: UserGroup[] = [mockGroup];

      service.getAllGroups().subscribe(groups => {
        expect(groups).toEqual(mockGroups);
        expect(groups.length).toBe(1);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroups);
    });

    it('should return empty array when no groups exist', () => {
      service.getAllGroups().subscribe(groups => {
        expect(groups).toEqual([]);
        expect(groups.length).toBe(0);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);
    });

    it('should handle HTTP error', () => {
      const errorMessage = 'Failed to load groups';

      service.getAllGroups().subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(errorMessage, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('getGroupById', () => {
    it('should fetch a group by id', () => {
      service.getGroupById('g1').subscribe(group => {
        expect(group).toEqual(mockGroup);
        expect(group.id).toBe('g1');
      });

      const req = httpMock.expectOne(`${apiUrl}/g1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockGroup);
    });

    it('should handle 404 when group not found', () => {
      service.getGroupById('nonexistent').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/nonexistent`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('createGroup', () => {
    it('should create a new group', () => {
      const newGroup: UserGroup = {
        id: '',
        name: 'DevOps',
        description: 'DevOps team',
        userIds: []
      };

      const createdGroup: UserGroup = { ...newGroup, id: 'g2' };

      service.createGroup(newGroup).subscribe(group => {
        expect(group).toEqual(createdGroup);
        expect(group.id).toBe('g2');
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newGroup);
      req.flush(createdGroup);
    });

    it('should handle validation error for duplicate name', () => {
      const duplicateGroup: UserGroup = {
        id: '',
        name: 'FE Team',
        description: 'Duplicate',
        userIds: []
      };

      service.createGroup(duplicateGroup).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush('Group already exists', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('updateGroup', () => {
    it('should update an existing group', () => {
      const updatedGroup: UserGroup = {
        ...mockGroup,
        name: 'FE Team Updated'
      };

      service.updateGroup(updatedGroup).subscribe(group => {
        expect(group.name).toBe('FE Team Updated');
      });

      const req = httpMock.expectOne(`${apiUrl}/g1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedGroup);
      req.flush(updatedGroup);
    });

    it('should handle 404 when updating non-existent group', () => {
      const nonExistentGroup: UserGroup = {
        id: 'nonexistent',
        name: 'Test',
        description: 'Test',
        userIds: []
      };

      service.updateGroup(nonExistentGroup).subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/nonexistent`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group', () => {
      service.deleteGroup('g1').subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/g1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle 404 when deleting non-existent group', () => {
      service.deleteGroup('nonexistent').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/nonexistent`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('assignUserToGroup', () => {
    it('should assign a user to a group', () => {
      const updatedGroup: UserGroup = {
        ...mockGroup,
        userIds: ['user1', 'user2', 'user3']
      };

      service.assignUserToGroup('g1', 'user3').subscribe(group => {
        expect(group.userIds).toContain('user3');
        expect(group.userIds.length).toBe(3);
      });

      const req = httpMock.expectOne(`${apiUrl}/g1/users/user3`);
      expect(req.request.method).toBe('POST');
      req.flush(updatedGroup);
    });

    it('should handle error when user does not exist', () => {
      service.assignUserToGroup('g1', 'nonexistent').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/g1/users/nonexistent`);
      req.flush('User not found', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('removeUserFromGroup', () => {
    it('should remove a user from a group', () => {
      service.removeUserFromGroup('g1', 'user1').subscribe(response => {
        expect(response).toBeUndefined();
      });

      const req = httpMock.expectOne(`${apiUrl}/g1/users/user1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle 404 when group not found', () => {
      service.removeUserFromGroup('nonexistent', 'user1').subscribe({
        next: () => fail('should have failed'),
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${apiUrl}/nonexistent/users/user1`);
      req.flush('Not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getGroupUsers', () => {
    it('should fetch user IDs for a group', () => {
      const userIds = ['user1', 'user2'];

      service.getGroupUsers('g1').subscribe(ids => {
        expect(ids).toEqual(userIds);
        expect(ids.length).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/g1/users`);
      expect(req.request.method).toBe('GET');
      req.flush(userIds);
    });

    it('should return empty array for group with no users', () => {
      service.getGroupUsers('g2').subscribe(ids => {
        expect(ids).toEqual([]);
        expect(ids.length).toBe(0);
      });

      const req = httpMock.expectOne(`${apiUrl}/g2/users`);
      req.flush([]);
    });
  });
});
