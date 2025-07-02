import { inject, Pipe, PipeTransform } from '@angular/core';
import { MIN, MAX } from '@shared/constants';
import { UtilsService } from 'app/services/utils.service';

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
        key.includes(MIN) || key.includes(MAX)
          ? this.between(key, item[this.toField(key)], searchParams[key])
          : this.like(item[key], searchParams[key])
      )
    );
  }

  private toField(keyMinMax: string): string {
    return keyMinMax.replace(MIN, '').replace(MAX, '');
  }

  private like(text: string, filters: string): boolean {
    return filters
      .split(',')
      .some((filter) =>
        this.toSimpleText(text).includes(this.toSimpleText(filter))
      );
  }

  private between(
    keyMinMax: string,
    value: string,
    valueMinMax: string
  ): boolean {
    if (
      !this.utilsService.isNumericString(value) ||
      !this.utilsService.isNumericString(valueMinMax)
    )
      return false;
    if (keyMinMax.includes(MIN)) {
      return +value >= +valueMinMax;
    } else {
      return +value <= +valueMinMax;
    }
  }

  private toSimpleText(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
