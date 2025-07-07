import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AUTHORS_HEADERS, AuthorService } from 'app/services/author.service';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss',
})
export class AuthorsComponent {
  private authorService = inject(AuthorService);

  authorsHeaders = AUTHORS_HEADERS;
  authors = toSignal(this.authorService.authors$);
}
