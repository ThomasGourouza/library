import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { TableComponent } from '../table/table.component';
import { BOOKS_HEADERS } from '@shared/constants';
import { BookService } from 'app/services/book.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private router = inject(Router);
  private bookService = inject(BookService);

  headers = BOOKS_HEADERS;
  books = toSignal(this.bookService.books$);

  onSelectedRow(newBookId: string | undefined): void {
    const path = ['/books'];
    if (!!newBookId) path.push(newBookId);
    this.router.navigate(path, {
      queryParamsHandling: 'preserve',
    });
  }
}
