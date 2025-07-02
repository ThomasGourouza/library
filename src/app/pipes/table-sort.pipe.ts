import { Pipe, PipeTransform } from '@angular/core';
import { SortParams } from '@shared/constants';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class TableSortPipe implements PipeTransform {
  transform(value: any[], sortParams: SortParams | null): any[] {
    console.log(sortParams);

    return value;
  }
}
