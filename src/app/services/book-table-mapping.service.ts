import { Injectable } from '@angular/core';
import { Book } from 'app/models/book/book';
import { BOOKS_HEADERS } from 'app/models/book/book-table-headers';
import { Audience, Category, Language, Status, Type } from 'app/models/enums';
import { TableItem } from 'app/models/types';

@Injectable({
  providedIn: 'root',
})
export class BookTableMappingService {

  mapToTableItem(books: Book[]): TableItem[] {
    return books.map((book) => ({
      id: `${book.id}`,
      ...Object.fromEntries(
        BOOKS_HEADERS.map(({ name }) => [name, `${this.getValue(name, book)}`])
      ),
    }));
  }

  private getValue(name: string, book: Book): string | number {
    let value: string | number = '';
    switch (name) {
      case 'originalTitle':
        if (!!book.originalTitle) {
          value = book.originalTitle;
        }
        break;
      case 'title':
        if (!!book.title.english) {
          value = book.title.english;
        }
        break;
      case 'author':
        if (!!book.author.name) {
          value = book.author.name;
        }
        break;
      case 'publicationDate':
        if (!!book.publicationDate) {
          value = new Date(book.publicationDate).getFullYear();
        }
        break;
      case 'language':
        value =
          !!book.language && book.language in Language
            ? Language[+Language[book.language]]
            : Language[+Language.UNKNOWN];
        break;
      case 'type':
        value =
          !!book.type && book.type in Type
            ? Type[+Type[book.type]]
            : Type[+Type.UNKNOWN];
        break;
      case 'category':
        value =
          !!book.category && book.category in Category
            ? Category[+Category[book.category]]
            : Category[+Category.UNKNOWN];
        break;
      case 'audience':
        value =
          !!book.audience && book.audience in Audience
            ? Audience[+Audience[book.audience]]
            : Audience[+Audience.UNKNOWN];
        break;
      case 'status':
        value =
          !!book.status && book.status in Status
            ? Status[+Status[book.status]]
            : Status[+Status.UNREAD];
        break;
      case 'favorite':
        value = `${!!book.favorite}`;
        break;
      default:
        break;
    }
    return value;
  }
}
