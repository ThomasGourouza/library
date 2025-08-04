import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TableComponent } from '../table/table.component';
import { BOOKS_HEADERS, BookService } from 'app/services/book.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { StructureComponent } from '../structure/structure.component';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent, StructureComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private bookService = inject(BookService);

  booksHeaders = BOOKS_HEADERS;
  books = toSignal(this.bookService.books$);
}
