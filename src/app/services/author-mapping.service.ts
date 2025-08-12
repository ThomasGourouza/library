import { inject, Injectable } from '@angular/core';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { Country } from 'app/models/enums';
import { TableItem } from 'app/models/types';
import { BookMappingService } from './book-mapping.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorMappingService {
  private readonly bookMappingService = inject(BookMappingService);

  mapAuthorWithEnums(authors: Author[]): Author[] {
    return authors.map((author) => ({
      ...author,
      books: !!author.books
        ? this.bookMappingService.mapBookWithEnums(author.books)
        : [],
      country:
        !!author.country && author.country in Country
          ? Country[author.country]
          : Country.UNKNOWN,
    }));
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

  private getValue(name: string, author: Author): string | number {
    let value: string | number = '';
    switch (name) {
      case 'name':
        value = author.name;
        break;
      case 'country':
        value = author.country;
        break;
      case 'birthYear':
        if (!!author.date.birth) {
          value = new Date(author.date.birth).getFullYear();
        }
        break;
      case 'deathYear':
        if (!!author.date.death) {
          value = new Date(author.date.death).getFullYear();
        }
        break;
      default:
        break;
    }
    return value;
  }
}
