import { Header, COLUMN_SETTINGS_KEY } from './constants';

type ColumnSettings = {
  name: string;
  isVisible: boolean;
  rank: number;
};

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function getFromLocalStorage(key: string): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(key);
}

function setToLocalStorage(key: string, value: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, value);
}


export function saveInLocalStorage(key: string, value: ColumnSettings[]): void {
  setToLocalStorage(key, JSON.stringify(value));
}

export function getHeadersWithLocalStorage(headers: Header[]): Header[] {
  const columnSettings: ColumnSettings[] =
    loadFromLocalStorage(COLUMN_SETTINGS_KEY);
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

export function mapToColumnSettings(headers: Header[]): ColumnSettings[] {
  return headers.map(({ name, isVisible, rank }) => ({
    name,
    isVisible,
    rank,
  }));
}

function loadFromLocalStorage(key: string): ColumnSettings[] {
  const raw = getFromLocalStorage(key);
  return safeParse(raw);
}

function safeParse(raw: string | null): ColumnSettings[] {
  if (raw == null) return [];
  try {
    return JSON.parse(raw) as ColumnSettings[];
  } catch {
    return [];
  }
}
