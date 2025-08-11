import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'headerIconSrc',
  standalone: true
})
export class HeaderIconSrcPipe implements PipeTransform {

  transform(icon: string): string {
    return icon ? `assets/icons/${icon}.svg` : '';
  }
}
