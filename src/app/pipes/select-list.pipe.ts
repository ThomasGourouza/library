import { Pipe, PipeTransform } from '@angular/core';
import {
  Audience,
  Category,
  Country,
  Language,
  Status,
  Type,
} from 'app/models/enums';
import { HeaderNameAuthor, HeaderNameBook } from 'app/models/header';
import { BOOLEAN } from 'app/models/types';

@Pipe({
  name: 'selectList',
  standalone: true,
})
export class SelectListPipe implements PipeTransform {
  transform(headerName: HeaderNameBook | HeaderNameAuthor): string[] {
    let options: string[] = [];
    switch (headerName) {
      case HeaderNameBook.LANGUAGE:
        options = Object.values(Language);
        break;
      case HeaderNameBook.TYPE:
        options = Object.values(Type);
        break;
      case HeaderNameBook.CATEGORY:
        options = Object.values(Category);
        break;
      case HeaderNameBook.AUDIENCE:
        options = Object.values(Audience);
        break;
      case HeaderNameBook.STATUS:
        options = Object.values(Status);
        break;
      case HeaderNameAuthor.COUNTRY:
        options = Object.values(Country);
        break;
      case HeaderNameBook.FAVORITE:
        options = [BOOLEAN.TRUE, BOOLEAN.FALSE];
        break;
      default:
        options = [];
    }
    return options;
  }
}
