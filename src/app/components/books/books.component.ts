import { Component, inject } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';
import { SelectedRow, TableComponent } from '../table/table.component';
import {
  distinctUntilChanged,
  filter,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  ALLOWED_FILTER_PARAMS_KEYS,
  Book,
  BOOKS_HEADERS,
} from '@shared/constants';
import { BookService } from 'app/services/book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent, AsyncPipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookService = inject(BookService);

  headers = BOOKS_HEADERS;
  books$: Observable<Book[]> = this.bookService.books$;

  bookId$ = this.router.events.pipe(
    filter((e): e is NavigationEnd => e instanceof NavigationEnd),
    map(() => this.route.snapshot.firstChild?.params?.['bookId']),
    startWith(this.route.snapshot.firstChild?.params?.['bookId']),
    distinctUntilChanged()
  );

  private readonly paramMap$ = this.route.queryParamMap.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  currentPage$ = this.paramMap$.pipe(
    map((p) => +p.get('page')!),
    distinctUntilChanged()
  );

  pageLimit$ = this.paramMap$.pipe(
    map((p) => +p.get('page_limit')!),
    distinctUntilChanged()
  );

  searchParams$ = this.paramMap$.pipe(
    map((p) =>
      Object.fromEntries(
        ALLOWED_FILTER_PARAMS_KEYS(BOOKS_HEADERS).map((field) => [
          field,
          p.get(field),
        ])
      )
    ),
    distinctUntilChanged((a, b) =>
      ALLOWED_FILTER_PARAMS_KEYS(BOOKS_HEADERS).every(
        (field) => a[field] === b[field]
      )
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
}
