import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { TableComponent } from '../table/table.component';
import { distinctUntilChanged, map, shareReplay, tap } from 'rxjs';
import { FilterPipe } from '../pipes/filter.pipe';
import { AsyncPipe } from '@angular/common';
import { SortPipe } from '../pipes/sort.pipe';
import { Book, BOOKS_HEADERS } from '@constants';
import { BOOKS } from './books-data';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterOutlet, TableComponent, AsyncPipe, FilterPipe, SortPipe],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss',
})
export class BooksComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);

  headers = BOOKS_HEADERS;
  books: Book[] = BOOKS;

  bookId$ = this.route.firstChild?.paramMap.pipe(
    map((p) => p.get('bookId')),
    distinctUntilChanged()
  );

  private readonly paramMap$ = this.route.queryParamMap.pipe(
    shareReplay({ bufferSize: 1, refCount: true })
  );

  currentPage$ = this.paramMap$.pipe(
    map((p) => +(p.get('page') ?? 1)),
    tap((page) => this.OnSelectedPage(page)),
    distinctUntilChanged()
  );

  searchParams$ = this.paramMap$.pipe(
    map((p) =>
      Object.fromEntries(BOOKS_HEADERS.map(({ name }) => [name, p.get(name)]))
    ),
    distinctUntilChanged((a, b) =>
      BOOKS_HEADERS.every(({ name }) => a[name] === b[name])
    )
  );

  sortParams$ = this.paramMap$.pipe(
    map((p) => ({
      sortColumn: p.get('sortColumn'),
      sortDirection: p.get('sortDirection'),
    })),
    distinctUntilChanged()
  );

  OnSelectedRow(rowId: string): void {
    this.router.navigate(['/books', rowId], {
      queryParamsHandling: 'preserve',
    });
  }

  OnSelectedPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }
}
