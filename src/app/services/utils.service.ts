import { Injectable } from '@angular/core';

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
}
