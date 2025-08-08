import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Header, TableItem, toAllowedQueryParamsKeys } from '@shared/constants';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

export const ALLOWED_AUTHOR_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(AUTHORS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  http = inject(HttpClient);
  private readonly url = 'assets/data/authors.json';

  get authors$(): Observable<TableItem[]> {
    return this.http.get<Author[]>(this.url).pipe(
      map((authors) => this.mapToTableItem(authors, AUTHORS_HEADERS)),
      catchError(() => of([])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  mapToTableItem(authors: Author[], headers: Header[]): TableItem[] {
    console.log(authors);

    return authors.flatMap((item) => [
      {
        ...Object.fromEntries(
          headers.map(({ name }) => {
            switch (name) {
              case 'birthDate':
                return [
                  name,
                  item.date.birth.getFullYear(),
                ];
              case 'deathDate':
                return [
                  name,
                  item.date.death?.getFullYear(),
                ];
              case 'deathAge':
                return [
                  name,
                  item.date.death ? item.date.death.getFullYear() - item.date.birth.getFullYear() : null,
                ];
              default:
                return [name, item[name as keyof Author] || ''];
            }
          })
        ),
        id: item.id,
      },
    ]);
  }
}
