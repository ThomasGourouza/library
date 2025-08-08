import { inject, Injectable } from '@angular/core';
import { TableItem, toAllowedQueryParamsKeys } from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { Author } from 'app/models/author/author';


export const ALLOWED_AUTHOR_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(AUTHORS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  utilsService = inject(UtilsService);
  http = inject(HttpClient);
  private readonly url = 'assets/data/authors.json';

  get authors$(): Observable<TableItem[]> {
    return this.http.get<Author[]>(this.url).pipe(
      map((item) => this.utilsService.withTitleAndId(item, AUTHORS_HEADERS)),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }
}
