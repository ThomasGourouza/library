// General
export const ALLOWED_QUERY_PARAMS_COMMON = [
  'page',
  'sortColumn',
  'sortDirection',
] as const;

// Table
export interface Header {
  name: string;
  label: string;
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
  { name: 'title', label: 'Titre' },
  { name: 'author', label: 'Auteur' },
  { name: 'year', label: 'Année' },
  { name: 'genre', label: 'Genre' },
] as const;
type HeaderName = (typeof BOOKS_HEADERS)[number]['name'];

export type Book = { id: string | undefined } & {
  [K in HeaderName]: string | undefined;
};
export const ALLOWED_BOOK_FILTER_PARAMS = [
  ...BOOKS_HEADERS.map(({ name }) => name),
  ...['year_min', 'year_max'],
];
export const ALLOWED_BOOK_QUERY_PARAMS = [
  ...ALLOWED_BOOK_FILTER_PARAMS,
  ...ALLOWED_QUERY_PARAMS_COMMON,
];
export const DEFAULT_BOOK_SORT_COLUMN = 'title' as const;
