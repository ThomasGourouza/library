import { inject, Injectable } from '@angular/core';
import { Header, ROW_ID, toAllowedQueryParamsKeys } from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

export const AUTHORS_HEADERS: Header[] = [
  { name: 'lastName', label: 'Last name', hasMinMax: false },
  { name: 'firstName', label: 'First name', hasMinMax: false },
  { name: 'birth', label: 'Birth', hasMinMax: true },
  { name: 'country', label: 'Country', hasMinMax: false },
] as const;

export const AUTHOR_MANDATORY_COLUMN = 'lastName';

type AuthorHeaderName = (typeof AUTHORS_HEADERS)[number]['name'];

export type Author = { [ROW_ID]: string } & {
  [K in AuthorHeaderName]: string | undefined;
};

export const ALLOWED_AUTHOR_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(AUTHORS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  utilsService = inject(UtilsService);
  http = inject(HttpClient);
  private readonly url = 'assets/data/authors.json';

  get authors$(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url).pipe(
      map((item) =>
        this.utilsService.withTitleAndId(
          item,
          AUTHORS_HEADERS,
          AUTHOR_MANDATORY_COLUMN
        )
      ),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
