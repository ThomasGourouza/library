import { inject, Injectable } from '@angular/core';
import {
  Header,
  HeaderType,
  ROW_ID,
  toAllowedQueryParamsKeys,
} from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

export const BOOKS_HEADERS: Header[] = [
  {
    name: 'title',
    label: 'Titre',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: false,
    isSelectAdd: false,
    sortDirection: null,
    rank: 1,
  },
  {
    name: 'author',
    label: 'Auteur',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 2,
  },
  {
    name: 'year',
    label: 'Année',
    type: HeaderType.NUMBER,
    isVisible: true,
    hasSelect: false,
    isSelectAdd: false,
    sortDirection: null,
    rank: 3,
  },
  {
    name: 'genre',
    label: 'Genre',
    type: HeaderType.TEXT,
    isVisible: true,
    hasSelect: true,
    isSelectAdd: false,
    sortDirection: null,
    rank: 4,
  },
] as const;

export const BOOK_MANDATORY_COLUMN = 'title';

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
          BOOK_MANDATORY_COLUMN
        )
      ),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
