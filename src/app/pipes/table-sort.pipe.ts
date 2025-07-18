import { inject, Pipe, PipeTransform } from '@angular/core';
import {
  AllowedQueryParamsCommon,
  SortParams,
  TableItem,
} from '@shared/constants';
import { UtilsService } from 'app/services/utils.service';

@Pipe({
  name: 'sort',
  standalone: true,
})
export class TableSortPipe implements PipeTransform {
  utilsService = inject(UtilsService);

  transform(list: TableItem[], sortParams: SortParams): TableItem[] {
    if (
      !sortParams ||
      !sortParams[AllowedQueryParamsCommon.SORT_COLUMN] ||
      !sortParams[AllowedQueryParamsCommon.SORT_DIRECTION]
    ) {
      return list;
    }
    const sortColumnValue = sortParams[AllowedQueryParamsCommon.SORT_COLUMN];
    const dir =
      sortParams[AllowedQueryParamsCommon.SORT_DIRECTION] === 'asc' ? 1 : -1;

    return [...list].sort((a, b) => {
      const av = a[sortColumnValue];
      const bv = b[sortColumnValue];

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
