import { Pipe, PipeTransform } from '@angular/core';
import { Audience, Category, Country, Language, Status, Type } from 'app/models/enums';

@Pipe({
  name: 'selectList',
  standalone: true
})
export class SelectListPipe implements PipeTransform {

  transform(headerName: string): string[] {
    let options: string[] = [];
    switch (headerName) {
      case 'language':
        options = Object.values(Language);
        break;
      case 'type':
        options = Object.values(Type);
        break;
      case 'category':
        options = Object.values(Category);
        break;
      case 'audience':
        options = Object.values(Audience);
        break;
      case 'status':
        options = Object.values(Status);
        break;
        case 'country':
          options = Object.values(Country);
          break;
      case 'favorite':
        options = ['true', 'false'];
        break;
      default:
        options = [];
    }
    return options;
  }
}
