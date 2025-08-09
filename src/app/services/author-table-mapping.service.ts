import { Injectable } from '@angular/core';
import { Author } from 'app/models/author/author';
import { AUTHORS_HEADERS } from 'app/models/author/author-table-headers';
import { Country } from 'app/models/enums';
import { TableItem } from 'app/models/types';

@Injectable({
  providedIn: 'root'
})
export class AuthorTableMappingService {

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
        if (!!author.name) {
          value = author.name;
        }
        break;
      case 'country':
        value =
          !!author.country && author.country in Country
            ? Country[+Country[author.country]]
            : Country[+Country.UNKNOWN];
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
      case 'deathAge':
        if (!!author.date.death) {
          value =
            new Date(author.date.death).getFullYear() -
            new Date(author.date.birth).getFullYear();
        }
        break;
      default:
        break;
    }
    return value;
  }
}
