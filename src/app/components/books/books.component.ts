import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterOutlet } from '@angular/router';
import { BOOKS_HEADERS } from 'app/models/book/book-table-headers';
import { BookMappingService } from 'app/services/book-mapping.service';
import { BookService } from 'app/services/book.service';
import { map } from 'rxjs';
import { StructureComponent } from '../structure/structure.component';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent, StructureComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private bookService = inject(BookService);
  private bookMappingService = inject(BookMappingService);

  booksHeaders = BOOKS_HEADERS;
  books = toSignal(this.bookService.books$.pipe(
    map((books) => this.bookMappingService.mapToTableItem(books))
  ));
}
