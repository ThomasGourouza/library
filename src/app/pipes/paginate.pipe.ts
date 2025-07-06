import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true,
})
export class PaginatePipe implements PipeTransform {
  transform(
    list: Record<string, string>[],
    currentPage: number,
    pageLimit: number
  ): Record<string, string>[] {
    const start = (currentPage - 1) * pageLimit;
    return list.slice(start, start + pageLimit);
  }
}
