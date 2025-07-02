import { inject, Injectable } from '@angular/core';
import { BOOKS } from 'app/data/books-data';
import { Book, BOOKS_HEADERS } from '@shared/constants';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  utilsService = inject(UtilsService);
  books: Book[] = BOOKS.map(this.toBook.bind(this));

  private toBook(book: any): Book {
    return Object.fromEntries([
      ['id', this.utilsService.makeId(book['title'])],
      ...BOOKS_HEADERS.map(({ name }) => [name, book[name]]),
    ]) as unknown as Book;
  }
}
