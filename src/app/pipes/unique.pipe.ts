import { inject, Pipe, PipeTransform } from '@angular/core';
import { TableItem } from 'app/models/types';
import { UtilsService } from 'app/services/utils.service';

@Pipe({
  name: 'unique',
  standalone: true,
})
export class UniquePipe implements PipeTransform {
  private readonly utilsService = inject(UtilsService);

  transform(list: TableItem[], headerName: string): string[] {
    if (!Array.isArray(list)) return [];
    const values = this.utilsService.cleanList(
      list.map((item) => item?.[headerName])
    );

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }
}
