import { Component} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TasksModule } from './features/tasks/tasks-module';
import { UsersModule } from './features/users/users-module';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TasksModule, CommonModule, UsersModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'bootcamp';
}
