// General
export const ALLOWED_QUERY_PARAMS_COMMON = [
  'page',
  'sortColumn',
  'sortDirection',
] as const;

export const MIN = '_min' as const;
export const MAX = '_max' as const;

// Table
export interface Header {
  name: string;
  label: string;
  minMax: boolean;
}
export interface SortParams {
  sortColumn: string | null;
  sortDirection: string | null;
}
export type SortDirection = 'asc' | 'desc';
export const ALLOWED_SORT_DIRECTIONS = ['asc', 'desc'] as const;
export const DEFAULT_SORT_DIRECTION = 'asc' as const;
export const ITEMS_PER_PAGE = 15;

// Books
export const BOOKS_HEADERS: Header[] = [
  { name: 'title', label: 'Titre', minMax: false },
  { name: 'author', label: 'Auteur', minMax: false },
  { name: 'year', label: 'Année', minMax: true },
  { name: 'genre', label: 'Genre', minMax: false },
] as const;
type HeaderName = (typeof BOOKS_HEADERS)[number]['name'];

export type Book = { id: string | undefined } & {
  [K in HeaderName]: string | undefined;
};

export const ALLOWED_BOOKS_FILTER_PARAMS: string[] = BOOKS_HEADERS.flatMap(
  ({ name, minMax }) =>
    minMax ? [name, `${name}${MIN}`, `${name}${MAX}`] : [name]
);

export const ALLOWED_BOOK_QUERY_PARAMS = [
  ...ALLOWED_BOOKS_FILTER_PARAMS,
  ...ALLOWED_QUERY_PARAMS_COMMON,
];
export const DEFAULT_BOOK_SORT_COLUMN = 'title' as const;
