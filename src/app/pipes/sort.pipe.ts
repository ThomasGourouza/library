import { Pipe, PipeTransform } from '@angular/core';
import { SortParams } from '@constants';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class SortPipe implements PipeTransform {
  transform(value: any[], sortParams: SortParams | null): any[] {
    console.log(sortParams);

    return value;
  }
}
