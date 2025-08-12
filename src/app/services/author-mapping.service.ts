import { inject, Injectable } from '@angular/core';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { Country } from 'app/models/enums';
import { TableItem } from 'app/models/types';
import { BookMappingService } from './book-mapping.service';
import { HeaderNameBook, HeaderNameAuthor } from 'app/models/header';

@Injectable({
  providedIn: 'root',
})
export class AuthorMappingService {
  private readonly bookMappingService = inject(BookMappingService);

  mapAuthorWithEnums(author: Author): Author {
    return {
      ...author,
      books: !!author.books
        ? author.books.map(this.bookMappingService.mapBookWithEnums)
        : [],
      country:
        !!author.country && author.country in Country
          ? Country[author.country]
          : Country.UNKNOWN,
    };
  }

  mapToTableItem(authors: Author[]): TableItem[] {
    return authors.map((author) => ({
      id: `${author.id}`,
      ...Object.fromEntries(
        AUTHORS_HEADERS.map(({ name }) => [
          name,
          `${this.getValue(name, author)}`,
        ])
      ),
    }));
  }

  private getValue(
    name: HeaderNameBook | HeaderNameAuthor,
    author: Author
  ): string | number {
    let value: string | number = '';
    switch (name) {
      case HeaderNameAuthor.NAME:
        value = author.name;
        break;
      case HeaderNameAuthor.COUNTRY:
        value = author.country;
        break;
      case HeaderNameAuthor.BIRTH_YEAR:
        if (!!author.date?.birth) {
          value = new Date(author.date.birth).getFullYear();
        }
        break;
      case HeaderNameAuthor.DEATH_YEAR:
        if (!!author.date?.death) {
          value = new Date(author.date.death).getFullYear();
        }
        break;
      default:
        break;
    }
    return value;
  }
}
