import { COLUMN_SETTINGS_KEY, ColumnSettings, Header } from './constants';

export function saveInLocalStorage(key: string, value: ColumnSettings[]): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromLocalStorage(key: string): ColumnSettings[] {
  const raw = localStorage.getItem(key);
  return safeParse(raw);
}

export function removeFromLocalStorage(key: string): void {
  localStorage.removeItem(key);
}

export function mapToColumnSettings(headers: Header[]): ColumnSettings[] {
  return headers.map(({ name, isVisible, rank }) => ({
    name,
    isVisible,
    rank,
  }));
}

export function headersWithLocalStorage(headers: Header[]): Header[] {
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

function safeParse(raw: string | null): ColumnSettings[] {
  if (raw == null) return [];
  try {
    return JSON.parse(raw) as ColumnSettings[];
  } catch {
    return [];
  }
}
