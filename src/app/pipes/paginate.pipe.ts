import { Pipe, PipeTransform } from '@angular/core';
import { TableItem } from '@shared/constants';

@Pipe({
  name: 'paginate',
  standalone: true,
})
export class PaginatePipe implements PipeTransform {
  transform(
    list: TableItem[],
    currentPage: number,
    pageLimit: number
  ): TableItem[] {
    const start = (currentPage - 1) * pageLimit;
    return list.slice(start, start + pageLimit);
  }
}
