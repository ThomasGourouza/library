import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'paginate',
  standalone: true,
})
export class PaginatePipe implements PipeTransform {
  transform(list: any[], currentPage: number, pageLimit: number): any[] {
    const start = (currentPage - 1) * pageLimit;
    return list.slice(start, start + pageLimit);
  }
}
