// General
export enum AllowedQueryParamsCommon {
  PAGE = 'page',
  PAGE_LIMIT = 'page_limit',
  SORT_COLUMN = 'sortColumn',
  SORT_DIRECTION = 'sortDirection',
}

export enum Between {
  MIN = '_min',
  MAX = '_max',
}

export const ROW_ID = 'id' as const;

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_LIMIT = 15;
export const MIN_PAGE_LIMIT = 5;
export const MAX_PAGE_LIMIT = 50;
export const DEFAULT_QUERY_PARAMS = {
  page: DEFAULT_PAGE,
  page_limit: DEFAULT_PAGE_LIMIT,
} as const;

export function toAllowedFilterParamsKeys(list: Header[]) {
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

// Books
export const BOOKS_HEADERS: Header[] = [
  { name: 'title', label: 'Titre', hasMinMax: false },
  { name: 'author', label: 'Auteur', hasMinMax: false },
  { name: 'year', label: 'Année', hasMinMax: true },
  { name: 'genre', label: 'Genre', hasMinMax: false },
] as const;

type BookHeaderName = (typeof BOOKS_HEADERS)[number]['name'];

// export type Book = { [ROW_ID]: string | undefined } & {
//   [K in BookHeaderName]: string | undefined;
// };

export const DEFAULT_BOOK_SORT_COLUMN = 'title';

export const ALLOWED_BOOK_QUERY_PARAMS_KEYS = [
  ...toAllowedFilterParamsKeys(BOOKS_HEADERS),
  ...Object.values(AllowedQueryParamsCommon),
];
