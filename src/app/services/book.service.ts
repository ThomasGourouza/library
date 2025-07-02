import { Injectable } from '@angular/core';
import { BOOKS } from '@shared/books-data';
import { Book, BOOKS_HEADERS } from '@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  books: Book[] = BOOKS.map(this.toBook.bind(this));

  private toBook(book: any): Book {
    return Object.fromEntries([
      ['id', this.makeId(book['title'])],
      ...BOOKS_HEADERS.map(({ name }) => [name, book[name]]),
    ]) as unknown as Book;
  }

  private makeId(title: string): string {
    return title
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/œ/g, 'oe')
      .normalize('NFD') // sépare les accents
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .toLowerCase()
      .replace(/['\s]+/g, '_') // espaces & apostrophes: _
      .replace(/[^a-z0-9_]/g, ''); // retire le reste
  }
}
