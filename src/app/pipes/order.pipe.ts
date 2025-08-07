import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Header } from '@shared/constants';

@Pipe({
  name: 'order',
  standalone: true,
})
@Injectable({ providedIn: 'root' })
export class OrderPipe implements PipeTransform {
  transform(list: readonly Header[]): Header[] {
    return [...list].sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
  }
}
