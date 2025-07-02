import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss',
})
export class AuthorsComponent {}
