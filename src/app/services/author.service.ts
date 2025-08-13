import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { toAllowedQueryParamsKeys } from 'app/models/types';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { AuthorMappingService } from './author-mapping.service';
import { environment } from 'environments/environment';
import { AuthorCreate } from 'app/models/author/author-create';

export const ALLOWED_AUTHOR_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(AUTHORS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class AuthorService {
  private readonly http = inject(HttpClient);
  private readonly authorMappingService = inject(AuthorMappingService);
  private readonly baseUrl = `${environment.apiUrl}/authors`;
  // private readonly baseUrl = 'assets/data/authors.json';

  get authors$(): Observable<Author[]> {
    return this.http.get<Author[]>(this.baseUrl).pipe(
      map((authors) =>
        authors.map((author) =>
          this.authorMappingService.mapAuthorWithEnums(author)
        )
      ),
      catchError((e) => {
        console.error(e);
        return of([]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  removeAuthor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createAuthor(authorCreate: AuthorCreate): Observable<Author | null> {
    return this.http.post<Author>(this.baseUrl, authorCreate).pipe(
      map(this.authorMappingService.mapAuthorWithEnums),
      catchError((e) => {
        console.error(e);
        return of(null);
      })
    );
  }

  /**
   * Returns the Location header /authors/{id} (for routing)
   */
  createAuthorWithLocation(
    payload: AuthorCreate
  ): Observable<{ author: Author; location: string | null }> {
    return this.http
      .post<Author>(this.baseUrl, payload, { observe: 'response' })
      .pipe(
        map((res: HttpResponse<Author>) => ({
          author: res.body as Author,
          location: res.headers.get('Location'),
        }))
      );
  }
}
