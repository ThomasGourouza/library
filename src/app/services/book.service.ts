import { inject, Injectable } from '@angular/core';
import {
  AllowedQueryParamsCommon,
  Header,
  ROW_ID,
  toAllowedFilterParamsKeys,
} from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

export const BOOKS_HEADERS: Header[] = [
  { name: 'title', label: 'Titre', hasMinMax: false },
  { name: 'author', label: 'Auteur', hasMinMax: false },
  { name: 'year', label: 'Année', hasMinMax: true },
  { name: 'genre', label: 'Genre', hasMinMax: false },
] as const;

type BookHeaderName = (typeof BOOKS_HEADERS)[number]['name'];
export type Book = { [ROW_ID]: string } & {
  [K in BookHeaderName]: string | undefined;
};
export const DEFAULT_BOOK_SORT_COLUMN = 'title';
export const ALLOWED_BOOK_QUERY_PARAMS_KEYS = [
  ...toAllowedFilterParamsKeys(BOOKS_HEADERS),
  ...Object.values(AllowedQueryParamsCommon),
];

@Injectable({
  providedIn: 'root',
})
export class BookService {
  utilsService = inject(UtilsService);
  http = inject(HttpClient);
  private readonly url = 'assets/data/books.json';

  get books$(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url).pipe(
      map(this.withTitleAndId.bind(this)),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private withTitleAndId(books: Book[]): Book[] {
    return books.flatMap((book) => {
      if (!book['title']) return [];
      return [
        {
          ...Object.fromEntries(
            BOOKS_HEADERS.map(({ name }) => [name, book[name]])
          ),
          [ROW_ID]: this.utilsService.makeId(book['title']!),
        },
      ];
    });
  }
}
