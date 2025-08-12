import { Pipe, PipeTransform } from '@angular/core';
import { HeaderType } from 'app/models/header';
import { SortDirection } from 'app/models/types';

@Pipe({
  name: 'sortIconSrc',
  standalone: true,
})
export class SortIconSrcPipe implements PipeTransform {
  transform(
    sortDirection: SortDirection | null,
    headerType: HeaderType
  ): string {
    if (headerType === HeaderType.NUMBER) {
      return sortDirection === SortDirection.ASC
        ? 'assets/icons/arrow-numeric-asc.svg'
        : 'assets/icons/arrow-numeric-desc.svg';
    }
    return sortDirection === SortDirection.ASC
      ? 'assets/icons/arrow-asc.svg'
      : 'assets/icons/arrow-desc.svg';
  }
}
