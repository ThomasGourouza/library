import { Pipe, PipeTransform } from '@angular/core';
import { TableItem } from '@shared/constants';

@Pipe({
  name: 'unique',
  standalone: true,
})
export class UniquePipe implements PipeTransform {
  transform(list: TableItem[], headerName: string): string[] {
    if (!Array.isArray(list)) return [];
    const values = list
      .map((item) => item?.[headerName])
      .filter((value): value is string => !!value && typeof value === 'string');

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }
}
