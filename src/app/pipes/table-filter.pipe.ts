import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true,
})
export class TableFilterPipe implements PipeTransform {
  transform(value: any[], searchParams: any): any[] {
    return value;
  }
}
