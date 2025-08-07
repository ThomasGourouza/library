import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Header } from '@shared/constants';

@Pipe({
  name: 'visible',
  standalone: true,
})
@Injectable({ providedIn: 'root' })
export class TableColumnVisiblePipe implements PipeTransform {
  transform(list: Header[]): Header[] {
    return list.filter(({ isVisible }) => isVisible);
  }
}
