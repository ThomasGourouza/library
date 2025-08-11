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
      switch (sortDirection) {
        case SortDirection.ASC:
          return 'assets/icons/arrow-numeric-up.svg';
        case SortDirection.DESC:
          return 'assets/icons/arrow-numeric-down.svg';
        default:
          return 'assets/icons/arrow-down-up.svg';
      }
    }
    switch (sortDirection) {
      case SortDirection.ASC:
        return 'assets/icons/arrow-up.svg';
      case SortDirection.DESC:
        return 'assets/icons/arrow-down.svg';
      default:
        return 'assets/icons/arrow-down-up.svg';
    }
  }
}
