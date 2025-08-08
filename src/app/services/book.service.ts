import { inject, Injectable } from '@angular/core';
import { TableItem, toAllowedQueryParamsKeys } from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { BOOKS_HEADERS } from 'app/models/book/book-table-headers';
import { Book } from 'app/models/book/book';


export const ALLOWED_BOOK_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(BOOKS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class BookService {
  utilsService = inject(UtilsService);
  http = inject(HttpClient);
  private readonly url = 'assets/data/books.json';

  get books$(): Observable<TableItem[]> {
    return this.http.get<Book[]>(this.url).pipe(
      map((item) => this.utilsService.withTitleAndId(item, BOOKS_HEADERS)),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
