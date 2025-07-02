import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class TableFilterPipe implements PipeTransform {
  transform(list: any[], searchParams: any): any[] {
    const activeKeys = Object.keys(searchParams).filter(
      (k) => searchParams[k] != null
    );
    if (activeKeys.length === 0) return list;
    return list.filter((item) =>
      activeKeys.every((key) => this.like(item[key], searchParams[key]))
    );
  }

  private like(text1: any, text2: string): boolean {
    return this.toSimpleText(text1).includes(this.toSimpleText(text2));
  }

  private toSimpleText(text: any): string {
    return String(text)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }
}
