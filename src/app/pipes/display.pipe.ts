import { Pipe, PipeTransform } from '@angular/core';
import { Language } from 'app/models/enums';
import { HeaderNameBook, HeaderNameAuthor } from 'app/models/header';

@Pipe({
  name: 'display',
  standalone: true,
})
export class DisplayPipe implements PipeTransform {
  transform(
    option: string,
    headerName: HeaderNameBook | HeaderNameAuthor,
    birthYear?: string,
    deathYear?: string
  ): string {
    // TODO: Translate
    if (!option && headerName !== HeaderNameAuthor.DEATH_YEAR) {
      return '-';
    }
    const lowerCaseOption = (
      option.charAt(0).toUpperCase() + option.slice(1).toLowerCase()
    )
      .replace('_', ' ')
      .trim();
    if (headerName === HeaderNameBook.LANGUAGE) {
      switch (option) {
        case Language.EN:
          return 'English';
        case Language.FR:
          return 'French';
        case Language.ES:
          return 'Spanish';
        case Language.DE:
          return 'German';
        case Language.IT:
          return 'Italian';
        case Language.ZH:
          return 'Chinese';
        case Language.JA:
          return 'Japanese';
        case Language.RU:
          return 'Russian';
        case Language.DA:
          return 'Danish';
        default:
          return lowerCaseOption;
      }
    }
    if (
      [
        HeaderNameBook.TYPE,
        HeaderNameBook.CATEGORY,
        HeaderNameBook.AUDIENCE,
        HeaderNameBook.STATUS,
        HeaderNameAuthor.COUNTRY,
        HeaderNameBook.FAVORITE,
      ].includes(headerName)
    ) {
      return lowerCaseOption;
    }
    if (headerName === HeaderNameAuthor.DEATH_YEAR) {
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
