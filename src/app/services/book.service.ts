import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from 'app/models/book/book';
import { BOOKS_HEADERS } from 'app/models/book/book-table-headers';
import { toAllowedQueryParamsKeys } from 'app/models/types';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';
import { BookMappingService } from './book-mapping.service';
import { environment } from 'environments/environment';
import { BookCreate } from 'app/models/book/book-create';
import { StatusUpdate } from 'app/models/book/status-update';
import { FavoriteUpdate } from 'app/models/book/favorite-update';
import { PersonalNotesUpdate } from 'app/models/book/personal-notes-update';

export const ALLOWED_BOOK_QUERY_PARAMS_KEYS =
  toAllowedQueryParamsKeys(BOOKS_HEADERS);

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly bookMappingService = inject(BookMappingService);
  private readonly baseUrl = `${environment.apiUrl}/books`;
  // private readonly baseUrl = 'assets/data/books.json';

  get books$(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl).pipe(
      map((books) => books.map(this.bookMappingService.mapBookWithEnums)),
      catchError((e) => {
        console.error(e);
        return of([]);
      }),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  removeBook(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  createBook(bookCreate: BookCreate): Observable<Book | null> {
    return this.http.post<Book>(this.baseUrl, bookCreate).pipe(
      map(this.bookMappingService.mapBookWithEnums),
      catchError((e) => {
        console.error(e);
        return of(null);
      })
    );
  }

  updateStatus(id: string, status: string): Observable<Book> {
    const body: StatusUpdate = { status };
    return this.http.patch<Book>(`${this.baseUrl}/${id}/status`, body);
  }

  updateFavorite(id: string, favorite: boolean): Observable<Book> {
    const body: FavoriteUpdate = { favorite };
    return this.http.patch<Book>(`${this.baseUrl}/${id}/favorite`, body);
  }

  updatePersonalNotes(id: string, personalNotes: string): Observable<Book> {
    const body: PersonalNotesUpdate = { personalNotes };
    return this.http.patch<Book>(`${this.baseUrl}/${id}/personal_notes`, body);
  }
}
