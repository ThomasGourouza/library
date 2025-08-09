import { Injectable } from '@angular/core';
import { Header } from 'app/models/header';
import { COLUMN_SETTINGS_KEY } from '../models/types';

type ColumnSettings = {
  name: string;
  isVisible: boolean;
  rank: number;
};

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  getHeadersFromLocalStorage(headers: Header[]): Header[] {
    const columnSettings: ColumnSettings[] =
      this.loadFromLocalStorage(COLUMN_SETTINGS_KEY);
    return headers.map((header) => {
      const settings = columnSettings.find(
        (setting) => setting.name === header.name
      );
      return {
        ...header,
        isVisible: settings?.isVisible ?? header.isVisible,
        rank: settings?.rank ?? header.rank,
      };
    });
  }

  saveHeadersInLocalStorage(headers: Header[]) {
    this.saveInLocalStorage(
      COLUMN_SETTINGS_KEY,
      headers.map(({ name, isVisible, rank }) => ({
        name,
        isVisible,
        rank,
      }))
    );
  }

  private saveInLocalStorage(key: string, value: ColumnSettings[]): void {
    this.setToLocalStorage(key, JSON.stringify(value));
  }

  private setToLocalStorage(key: string, value: string): void {
    if (!this.isBrowser()) return;
    localStorage.setItem(key, value);
  }

  private loadFromLocalStorage(key: string): ColumnSettings[] {
    const raw = this.getFromLocalStorage(key);
    return this.safeParse(raw);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private getFromLocalStorage(key: string): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem(key);
  }

  private safeParse(raw: string | null): ColumnSettings[] {
    if (raw == null) return [];
    try {
      return JSON.parse(raw) as ColumnSettings[];
    } catch {
      return [];
    }
  }
}
