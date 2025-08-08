import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AuthorService } from 'app/services/author.service';
import { TableComponent } from '../table/table.component';
import { StructureComponent } from '../structure/structure.component';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [RouterOutlet, TableComponent, StructureComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss',
})
export class AuthorsComponent {
  private authorService = inject(AuthorService);

  authorsHeaders = AUTHORS_HEADERS;
  authors = toSignal(this.authorService.authors$);
}
