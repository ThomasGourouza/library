import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { toAllowedQueryParamsKeys } from 'app/models/types';
import { catchError, Observable, of, shareReplay } from 'rxjs';

export const ALLOWED_AUTHOR_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(AUTHORS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  http = inject(HttpClient);
  private readonly url = 'assets/data/authors.json';

  get authors$(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url).pipe(
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
