import { Injectable } from '@angular/core';
import {
  DEFAULT_PAGE,
  DEFAULT_ROWS_LIMIT,
  ROWS_LIMIT_LIST,
} from 'app/models/types';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  isNumericString(s: string): boolean {
    return /^\d+$/.test(s);
  }

  withoutLastComma(value: string): string {
    return value.endsWith(',') ? value.slice(0, -1) : value;
  }

  isCorrectPage(value: string | undefined): boolean {
    return !!value && this.isNumericString(value) && +value >= 1;
  }

  isCorrectRowsLimit(value: string | undefined): boolean {
    return (
      !!value && this.isNumericString(value) && ROWS_LIMIT_LIST.includes(+value)
    );
  }

  toCorrectPage(page: string | undefined): number {
    if (!this.isCorrectPage(page)) return DEFAULT_PAGE;
    return +page!;
  }

  toCorrectRowsLimit(rowsLimit: string | undefined): number {
    if (
      !rowsLimit ||
      !this.isNumericString(rowsLimit) ||
      !ROWS_LIMIT_LIST.includes(+rowsLimit)
    )
      return DEFAULT_ROWS_LIMIT;
    return +rowsLimit;
  }

  cleanList(list: (string | undefined | null)[]): string[] {
    return list.filter((item): item is string => !!item && item.trim() !== '');
  }
}
