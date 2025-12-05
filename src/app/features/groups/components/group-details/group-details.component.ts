import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { GroupStore } from '../../store/group.store';
import { UserGroup } from '../../models/group.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrl: './group-details.component.scss',
  standalone: false,
})
export class GroupDetailsComponent {
  protected store = inject(GroupStore);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  groupForm: FormGroup;
  
  group = computed(() => this.store.selectedGroup());
  
  groupId = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  constructor() {
    this.groupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });

    effect(() => {
      const id = this.groupId();
      if (id) {
        this.store.loadGroupById(id);
      } else {
        this.store.clearSelectedGroup();
        this.groupForm.reset();
      }
    });

    effect(() => {
      const currentGroup = this.group();
      if (currentGroup) {
        this.groupForm.patchValue({
          name: currentGroup.name,
          description: currentGroup.description
        });
      }
    });
  }

  get name() {
    return this.groupForm.get('name');
  }

  get description() {
    return this.groupForm.get('description');
  }

  onSubmit() {
    if (this.groupForm.invalid) {
      this.groupForm.markAllAsTouched();
      return;
    }
    
    const currentGroup = this.group();
    if (currentGroup) {
      // Edit mode
      const updatedGroup: UserGroup = {
        ...currentGroup,
        ...this.groupForm.value
      };
      this.store.updateGroup(updatedGroup);
    } else {
      // Create mode
      this.store.createGroup(this.groupForm.value);
    }
  }
}
