import { Pipe, PipeTransform } from '@angular/core';
import { SortDirection } from '@shared/constants';

@Pipe({
  name: 'iconSrc',
  standalone: true,
})
export class IconSrcPipe implements PipeTransform {
  transform(sortDirection: SortDirection | null): string {
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
