import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { SelectedRow, TableComponent } from '../table/table.component';
import { distinctUntilChanged, map, Observable, shareReplay, tap } from 'rxjs';
import { TableFilterPipe } from '../../pipes/table-filter.pipe';
import { AsyncPipe } from '@angular/common';
import { TableSortPipe } from '../../pipes/table-sort.pipe';
import {
  ALLOWED_BOOKS_FILTER_PARAMS,
  Book,
  BOOKS_HEADERS,
} from '@shared/constants';
import { BookService } from 'app/services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [
    RouterOutlet,
    TableComponent,
    AsyncPipe,
    TableFilterPipe,
    TableSortPipe,
  ],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  bookService = inject(BookService);

  headers = BOOKS_HEADERS;
  books$: Observable<Book[]> = this.bookService.books$;

  bookId$ = this.route.firstChild?.paramMap.pipe(
    map((p) => p.get('bookId')),
    distinctUntilChanged()
  );

  private readonly paramMap$ = this.route.queryParamMap.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  currentPage$ = this.paramMap$.pipe(
    map((p) => +(p.get('page') ?? 1)),
    // tap((page) => this.onSelectedPage(page)),
    distinctUntilChanged()
  );

  searchParams$ = this.paramMap$.pipe(
    map((p) =>
      Object.fromEntries(
        ALLOWED_BOOKS_FILTER_PARAMS.map((field) => [field, p.get(field)])
      )
    ),
    distinctUntilChanged((a, b) =>
      ALLOWED_BOOKS_FILTER_PARAMS.every((field) => a[field] === b[field])
    )
  );

  sortParams$ = this.paramMap$.pipe(
    map((p) => ({
      sortColumn: p.get('sortColumn'),
      sortDirection: p.get('sortDirection'),
    })),
    distinctUntilChanged()
  );

  onSelectedRow(selectedRow: SelectedRow): void {
    const newBookId =
      selectedRow.previousId !== selectedRow.newId ? selectedRow.newId : null;
    const path = ['/books'];
    if (newBookId !== null) path.push(newBookId);
    this.router.navigate(path, {
      queryParamsHandling: 'preserve',
    });
  }

  onSelectedPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
