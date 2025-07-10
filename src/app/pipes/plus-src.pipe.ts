import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'plusSrc',
  standalone: true,
})
export class PlusSrcPipe implements PipeTransform {
  transform(isPlusAdd: boolean): string {
    return isPlusAdd
      ? 'assets/icons/plus-circle-fill.svg'
      : 'assets/icons/plus-circle.svg';
  }
}
