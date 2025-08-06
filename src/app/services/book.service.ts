import { inject, Injectable } from '@angular/core';
import {
  ROW_ID,
  toAllowedQueryParamsKeys,
} from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { BOOKS_HEADERS } from 'app/models/book';

export const BOOK_MANDATORY_COLUMN = 'title' as const;

type BookHeaderName = (typeof BOOKS_HEADERS)[number]['name'];

export type Book = { [ROW_ID]: string } & {
  [K in BookHeaderName]: string | undefined;
};

export const ALLOWED_BOOK_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(BOOKS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class BookService {
  utilsService = inject(UtilsService);
  http = inject(HttpClient);
  private readonly url = 'assets/data/books.json';

  get books$(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url).pipe(
      map((item) =>
        this.utilsService.withTitleAndId(
          item,
          BOOKS_HEADERS,
        )
      ),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
