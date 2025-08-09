import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'display',
  standalone: true,
})
export class DisplayPipe implements PipeTransform {
  transform(option: string, headerName: string): string {
    // TODO: Translate
    const lowerCaseOption = (
      option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()
    )
      .replace('_', ' ')
      .trim();
    if (headerName === 'language') {
      switch (option) {
        case 'EN':
          return 'English';
        case 'FR':
          return 'French';
        case 'ES':
          return 'Spanish';
        case 'DE':
          return 'German';
        case 'IT':
          return 'Italian';
        case 'ZH':
          return 'Chinese';
        case 'JA':
          return 'Japanese';
        case 'RU':
          return 'Russian';
        case 'DA':
          return 'Danish';
        default:
          return lowerCaseOption;
      }
    }
    if (
      [
        'type',
        'category',
        'audience',
        'status',
        'country',
        'favorite',
      ].includes(headerName)
    ) {
      return lowerCaseOption;
    }
    return option;
  }
}
