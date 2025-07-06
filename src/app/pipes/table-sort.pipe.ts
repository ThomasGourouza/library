import { inject, Pipe, PipeTransform } from '@angular/core';
import { SortParams } from '@shared/constants';
import { UtilsService } from 'app/services/utils.service';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class TableSortPipe implements PipeTransform {
  utilsService = inject(UtilsService);

  transform(list: any[], sortParams: SortParams | undefined): any[] {
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

      if (
        this.utilsService.isNumericString(av) &&
        this.utilsService.isNumericString(bv)
      ) {
        const diff = Number(av) - Number(bv);
        return diff === 0 ? 0 : diff > 0 ? dir : -dir;
      }

      return av.localeCompare(bv, undefined, { sensitivity: 'base' }) * dir;
    });
  }
}
