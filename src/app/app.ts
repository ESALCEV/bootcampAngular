import { Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';
import { TasksModule } from './features/tasks/tasks-module';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TasksModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected title = 'bootcamp';
}
