import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(value: any[], sortParams: any): any[] {
    console.log(sortParams);

    return value;
  }
}
