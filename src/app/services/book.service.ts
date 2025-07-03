import { inject, Injectable } from '@angular/core';
import { Book } from '@shared/constants';
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

  get books$(): Observable<Book[]> {
    return this.http.get<Book[]>(this.url).pipe(
      map(this.withTitleAndId.bind(this)),
      catchError(() => of([] as Book[])),
      shareReplay(1)
    );
  }

  private withTitleAndId(books: Book[]): Book[] {
    return books
      .filter(({ title }) => !!title)
      .map((book) => ({
        ...book,
        id: this.utilsService.makeId(book['title']!),
      }));
  }
}
