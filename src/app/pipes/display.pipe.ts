import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'display',
  standalone: true,
})
export class DisplayPipe implements PipeTransform {
  transform(
    option: string,
    headerName: string,
    birthYear?: string,
    deathYear?: string
  ): string {
    // TODO: Translate
    if (!option && headerName !== 'deathYear') {
      return '-';
    }
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
    if (headerName === 'deathYear') {
      if (this.isNullOrEmpty(birthYear)) {
        if (this.isNullOrEmpty(deathYear)) {
          return '-';
        }
        return deathYear + ' (?)';
      }
      const maxYear = !this.isNullOrEmpty(deathYear)
        ? deathYear!
        : new Date().getFullYear();
      const age = +maxYear - +birthYear!;
      return (
        (!this.isNullOrEmpty(deathYear) ? deathYear : '-') + ' (' + age + ')'
      );
    }
    return option;
  }

  private isNullOrEmpty(value: string | undefined): boolean {
    return !value || value === '';
  }
}
