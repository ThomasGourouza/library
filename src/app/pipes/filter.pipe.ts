import { Pipe, PipeTransform } from '@angular/core';
import { Book } from '../books/books.component';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchParams: any): any[] {
    return value;
  }
}
