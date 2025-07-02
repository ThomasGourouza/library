import { Pipe, PipeTransform } from '@angular/core';
import { SortParams } from '@shared/constants';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class TableSortPipe implements PipeTransform {
  transform(list: any[], sortParams: SortParams | null): any[] {
    if (!sortParams || !sortParams.sortColumn || !sortParams.sortDirection) {
      return list;
    }
    const sortColumn = sortParams.sortColumn;
    const dir = sortParams.sortDirection === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      const av = a[sortColumn];
      const bv = b[sortColumn];

      if (av == null && bv == null) return 0;
      if (av == null) return 1 * dir;
      if (bv == null) return -1 * dir;

      if (this.isNumericString(av) && this.isNumericString(bv)) {
        const diff = Number(av) - Number(bv);
        return diff === 0 ? 0 : diff > 0 ? dir : -dir;
      }

      return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
    });
  }

  private isNumericString(s: string): boolean {
    return /^\d+$/.test(s);
  }
}
