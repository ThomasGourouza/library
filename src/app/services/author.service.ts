import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { toAllowedQueryParamsKeys } from 'app/models/types';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { AuthorMappingService } from './author-mapping.service';

export const ALLOWED_AUTHOR_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(AUTHORS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly http = inject(HttpClient);
  private readonly authorMappingService = inject(
    AuthorMappingService
  );
  private readonly url = 'assets/data/authors.json';

  get authors$(): Observable<Author[]> {
    return this.http.get<Author[]>(this.url).pipe(
      map((authors) => this.authorMappingService.mapAuthorWithEnums(authors)),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
