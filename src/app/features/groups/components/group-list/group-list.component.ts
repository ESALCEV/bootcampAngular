import { Component, inject } from '@angular/core';
import { GroupStore } from '../../store/group.store';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrl: './group-list.component.scss',
  standalone: false,
})
export class GroupListComponent {
  readonly store = inject(GroupStore);

  constructor() {
    this.store.loadGroups();
  }

  deleteGroup(id: string) {
    if (confirm('Are you sure you want to delte this group?')) {
      this.store.deleteGroup(id);
    }
  }
}
