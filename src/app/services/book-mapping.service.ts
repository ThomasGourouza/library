import { Injectable } from '@angular/core';
import { Book } from 'app/models/book/book';
import { BOOKS_HEADERS } from 'app/models/book/book-table-headers';
import {
  Audience,
  Category,
  Country,
  Language,
  Status,
  Type,
} from 'app/models/enums';
import { TableItem } from 'app/models/types';

@Injectable({
  providedIn: 'root',
})
export class BookMappingService {

  mapBookWithEnums(books: Book[]): Book[] {
    return books.map((book) => ({
      ...book,
      author: {
        ...book.author,
        country:
          !!book.author.country && book.author.country in Country
            ? Country[book.author.country]
            : Country.UNKNOWN,
      },
      language:
        !!book.language && book.language in Language
          ? Language[book.language]
          : Language.UNKNOWN,
      type:
        !!book.type && book.type in Type
          ? Type[book.type]
          : Type.UNKNOWN,
      category:
        !!book.category && book.category in Category
          ? Category[book.category]
          : Category.UNKNOWN,
      audience:
        !!book.audience && book.audience in Audience
          ? Audience[book.audience]
          : Audience.UNKNOWN,
      status:
        !!book.status && book.status in Status
          ? Status[book.status]
          : Status.UNREAD,
      favorite: !!book.favorite,
    }));
  }

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
      case 'favorite':
        value = `${book.favorite}`;
        break;
      default:
        value = book[name as keyof Book].toString();
        break;
    }
    return value;
  }
}
