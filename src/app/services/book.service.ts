import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from 'app/models/book/book';
import { BOOKS_HEADERS } from 'app/models/book/book-table-headers';
import { toAllowedQueryParamsKeys } from 'app/models/types';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { BookMappingService } from './book-mapping.service';

export const ALLOWED_BOOK_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(BOOKS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly bookMappingService = inject(BookMappingService);
  private readonly url = 'assets/data/books.json';

  get books$(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url).pipe(
      map((books) => this.bookMappingService.mapBookWithEnums(books)),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
