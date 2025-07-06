import { inject, Injectable } from '@angular/core';
import { ROW_ID } from '@shared/constants';
import { UtilsService } from './utils.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  utilsService = inject(UtilsService);
  http = inject(HttpClient);
  private readonly url = 'assets/data/books.json';

  get books$(): Observable<Record<string, string>[]> {
    return this.http.get<Record<string, string>[]>(this.url).pipe(
      map(this.withTitleAndId.bind(this)),
      catchError(() => of([] as Record<string, string>[])),
      shareReplay({ bufferSize: 1, refCount: true })
    );
  }

  private withTitleAndId(
    books: Record<string, string>[]
  ): Record<string, string>[] {
    return books
      .filter(({ title }) => !!title)
      .map((book) => ({
        ...book,
        [ROW_ID]: this.utilsService.makeId(book['title']!),
      }));
  }
}
