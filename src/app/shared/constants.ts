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
export const ITEMS_PER_PAGE = 15;

// Books
export const BOOKS_HEADERS: Header[] = [
  { name: 'title', label: 'Titre', hasMinMax: false },
  { name: 'author', label: 'Auteur', hasMinMax: false },
  { name: 'year', label: 'Année', hasMinMax: true },
  { name: 'genre', label: 'Genre', hasMinMax: false },
  { name: 'description', label: 'Description', hasMinMax: false },
] as const;

type HeaderName = (typeof BOOKS_HEADERS)[number]['name'];

export type Book = { id: string | undefined } & {
  [K in HeaderName]: string | undefined;
};

export const DEFAULT_BOOK_SORT_COLUMN = 'title';

export const ALLOWED_BOOKS_FILTER_PARAMS: string[] = BOOKS_HEADERS.flatMap(
  ({ name, hasMinMax }) =>
    hasMinMax
      ? [name, `${name}${Between.MIN}`, `${name}${Between.MAX}`]
      : [name]
);

export const ALLOWED_BOOK_QUERY_PARAMS = [
  ...ALLOWED_BOOKS_FILTER_PARAMS,
  ...ALLOWED_QUERY_PARAMS_COMMON,
];
