import { inject, Pipe, PipeTransform } from '@angular/core';
import { Params } from '@angular/router';
import { Between, TableItem } from '@shared/constants';
import { UtilsService } from 'app/services/utils.service';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class TableFilterPipe implements PipeTransform {
  utilsService = inject(UtilsService);

  transform(list: TableItem[], searchParams: Params): TableItem[] {
    const activeKeys = Object.keys(searchParams).filter(
      (k) => searchParams[k] != null
    );
    if (activeKeys.length === 0) return list;
    return list.filter((item) =>
      activeKeys.every((key) =>
        key.includes(Between.MIN) || key.includes(Between.MAX)
          ? this.between(key, item[this.toField(key)], searchParams[key])
          : this.like(item[key], searchParams[key])
      )
    );
  }

  private toField(keyMinMax: string): string {
    return keyMinMax.replace(Between.MIN, '').replace(Between.MAX, '');
  }

  private like(text: string | undefined, filters: string): boolean {
    return filters
      .split(',')
      .some((filter) =>
        this.toSimpleText(text).includes(this.toSimpleText(filter))
      );
  }

  private between(
    keyMinMax: string,
    value: string | undefined,
    valueMinMax: string
  ): boolean {
    if (
      !value ||
      !this.utilsService.isNumericString(value) ||
      !this.utilsService.isNumericString(valueMinMax)
    )
      return false;
    if (keyMinMax.includes(Between.MIN)) {
      return +value >= +valueMinMax;
    } else {
      return +value <= +valueMinMax;
    }
  }

  private toSimpleText(text: string | undefined): string {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
