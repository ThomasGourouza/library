import { Injectable } from '@angular/core';
import {
  DEFAULT_ROWS_LIMIT,
  DEFAULT_PAGE,
  TableItem,
  Header,
  ROWS_LIMIT_LIST,
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

  // TODO: TableItem -> any -> ?
  withTitleAndId(items: any[], headers: Header[]): TableItem[] {
    return items.flatMap((item) => [
      {
        ...Object.fromEntries(
          headers.map(({ name }) => {
            switch (name) {
              case 'title':
                return [name, item.title.french];
              case 'author':
                return [name, item.author.name];
              case 'description':
                return [name, item.description.french];
              default:
                return [name, item[name]];
            }
          })
        ),
        id: item.id,
      },
    ]);
  }

  cleanList(list: (string | undefined | null)[]): string[] {
    return list.filter((item): item is string => !!item && item.trim() !== '');
  }
}
