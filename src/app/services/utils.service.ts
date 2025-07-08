import { Injectable } from '@angular/core';
import {
  DEFAULT_PAGE_LIMIT,
  DEFAULT_PAGE,
  TableItem,
  Header,
  ROW_ID,
  PAGE_LIMITS,
} from '@shared/constants';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  makeId(text: string): string {
    return text
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/œ/g, 'oe')
      .normalize('NFD') // sépare les accents
      .replace(/[\u0300-\u036f]/g, '') // supprime les accents
      .toLowerCase()
      .replace(/['\s]+/g, '_') // espaces & apostrophes: _
      .replace(/[^a-z0-9_]/g, ''); // retire le reste
  }

  isNumericString(s: string): boolean {
    return /^\d+$/.test(s);
  }

  withoutLastComma(value: string): string {
    return value.endsWith(',') ? value.slice(0, -1) : value;
  }

  isCorrectPage(value: string | undefined): boolean {
    return !!value && this.isNumericString(value) && +value >= 1;
  }

  isCorrectPageLimit(value: string | undefined): boolean {
    return (
      !!value && this.isNumericString(value) && PAGE_LIMITS.includes(+value)
    );
  }

  toCorrectPage(page: string | undefined): number {
    if (!this.isCorrectPage(page)) return DEFAULT_PAGE;
    return +page!;
  }

  toCorrectPageLimit(pageLimit: string | undefined): number {
    if (
      !pageLimit ||
      !this.isNumericString(pageLimit) ||
      !PAGE_LIMITS.includes(+pageLimit)
    )
      return DEFAULT_PAGE_LIMIT;
    return +pageLimit;
  }

  withTitleAndId(
    items: TableItem[],
    headers: Header[],
    mandatoryColumn: string
  ): TableItem[] {
    return items.flatMap((item) =>
      !item[mandatoryColumn]
        ? []
        : [
            {
              ...Object.fromEntries(
                headers.map(({ name }) => [name, item[name]])
              ),
              [ROW_ID]: this.makeId(item[mandatoryColumn]!),
            },
          ]
    );
  }
}
