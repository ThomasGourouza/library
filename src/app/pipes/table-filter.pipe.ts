import { inject, Pipe, PipeTransform } from '@angular/core';
import { UtilsService } from 'app/services/utils.service';

const YEAR = 'year';
@Pipe({
  name: 'filter',
  standalone: true,
})
export class TableFilterPipe implements PipeTransform {
  utilsService = inject(UtilsService);

  transform(list: any[], searchParams: any): any[] {
    const activeKeys = Object.keys(searchParams).filter(
      (k) => searchParams[k] != null
    );
    if (activeKeys.length === 0) return list;
    return list.filter((item) =>
      activeKeys.every((key) =>
        [`${YEAR}_min`, `${YEAR}_max`].includes(key)
          ? this.between(key, item[YEAR], searchParams[key])
          : this.like(item[key], searchParams[key])
      )
    );
  }

  private like(text: string, filters: string): boolean {
    return filters
      .split(',')
      .some((filter) =>
        this.toSimpleText(text).includes(this.toSimpleText(filter))
      );
  }

  private between(key: string, year: string, yearMinMax: string): boolean {
    if (
      !this.utilsService.isNumericString(year) ||
      !this.utilsService.isNumericString(yearMinMax)
    )
      return false;
    if (`${YEAR}_min` === key) {
      return +year >= +yearMinMax;
    } else {
      return +year <= +yearMinMax;
    }
  }

  private toSimpleText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
