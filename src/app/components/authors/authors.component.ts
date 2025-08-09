import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { AuthorTableMappingService } from 'app/services/author-table-mapping.service';
import { AuthorService } from 'app/services/author.service';
import { map } from 'rxjs';
import { StructureComponent } from '../structure/structure.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [RouterOutlet, TableComponent, StructureComponent],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.scss',
})
export class AuthorsComponent {
  private authorService = inject(AuthorService);
  private authorTableMappingService = inject(AuthorTableMappingService);

  authorsHeaders = AUTHORS_HEADERS;
  authors = toSignal(this.authorService.authors$.pipe(
    map((authors) => this.authorTableMappingService.mapToTableItem(authors))
  ));
}
