// General
export const ALLOWED_QUERY_PARAMS_COMMON = [
  'page',
  'sortColumn',
  'sortDirection',
] as const;

export enum Between {
  MIN = '_min',
  MAX = '_max',
}

export function ALLOWED_FILTER_PARAMS(list: Header[]) {
  return list.flatMap(({ name, hasMinMax }) =>
    hasMinMax
      ? [name, `${name}${Between.MIN}`, `${name}${Between.MAX}`]
      : [name]
  );
}

// Table
export interface Header {
  name: string;
  label: string;
  hasMinMax: boolean;
}
export interface SortParams {
  sortColumn: string | null;
  sortDirection: string | null;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}
export const DEFAULT_SORT_DIRECTION = SortDirection.ASC as const;
export const ITEMS_PER_PAGE_DEFAULT = 2;

// Books
export const BOOKS_HEADERS: Header[] = [
  { name: 'title', label: 'Titre', hasMinMax: false },
  { name: 'author', label: 'Auteur', hasMinMax: false },
  { name: 'year', label: 'Année', hasMinMax: true },
  { name: 'genre', label: 'Genre', hasMinMax: false },
] as const;

type BookHeaderName = (typeof BOOKS_HEADERS)[number]['name'];

export type Book = { id: string | undefined } & {
  [K in BookHeaderName]: string | undefined;
};

export const DEFAULT_BOOK_SORT_COLUMN = 'title';

export const ALLOWED_BOOK_QUERY_PARAMS = [
  ...ALLOWED_FILTER_PARAMS(BOOKS_HEADERS),
  ...ALLOWED_QUERY_PARAMS_COMMON,
];
