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
import { HeaderNameAuthor, HeaderNameBook } from 'app/models/header';
import { TableItem } from 'app/models/types';

@Injectable({
  providedIn: 'root',
})
export class BookMappingService {

  mapBookWithEnums(book: Book): Book {
    return {
      ...book,
      author: {
        ...book.author,
        country:
          !!book.author?.country && book.author.country in Country
            ? Country[book.author.country]
            : Country.UNKNOWN,
      },
      language:
        !!book.language && book.language in Language
          ? Language[book.language]
          : Language.UNKNOWN,
      type: !!book.type && book.type in Type ? Type[book.type] : Type.UNKNOWN,
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
    };
  }

  mapToTableItem(books: Book[]): TableItem[] {
    return books.map((book) => ({
      id: `${book.id}`,
      ...Object.fromEntries(
        BOOKS_HEADERS.map(({ name }) => [name, `${this.getValue(name, book)}`])
      ),
    }));
  }

  private getValue(
    name: HeaderNameBook | HeaderNameAuthor,
    book: Book
  ): string | number {
    let value: string | number = '';
    switch (name) {
      case HeaderNameBook.ORIGINAL_TITLE:
        if (!!book.originalTitle) {
          value = book.originalTitle;
        }
        break;
      case HeaderNameBook.TITLE:
        if (!!book.title.english) {
          value = book.title.english;
        }
        break;
      case HeaderNameBook.AUTHOR:
        if (!!book.author.name) {
          value = book.author.name;
        }
        break;
      case HeaderNameBook.PUBLICATION_DATE:
        if (!!book.publicationDate) {
          value = new Date(book.publicationDate).getFullYear();
        }
        break;
      case HeaderNameBook.FAVORITE:
        value = `${book.favorite}`;
        break;
      case HeaderNameBook.TYPE:
        value = book.type;
        break;
      case HeaderNameBook.STATUS:
        value = book.status;
        break;
      case HeaderNameBook.AUDIENCE:
        value = book.audience;
        break;
      case HeaderNameBook.CATEGORY:
        value = book.category;
        break;
      case HeaderNameBook.LANGUAGE:
        value = book.language;
        break;
      default:
        break;
    }
    return value;
  }
}
