export enum AllowedQueryParamsCommon {
  PAGE = 'page',
  PAGE_LIMIT = 'page_limit',
  SORT_COLUMN = 'sort_column',
  SORT_DIRECTION = 'sort_direction',
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

export function toAllowedQueryParamsKeys(list: Header[]) {
  return [
    ...toAllowedFilterParamsKeys(list),
    ...Object.values(AllowedQueryParamsCommon),
  ];
}

export interface Header {
  name: string;
  label: string;
  hasMinMax: boolean;
  isVisible: boolean;
  sortDirection: SortDirection | null;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortParams {
  [AllowedQueryParamsCommon.SORT_COLUMN]: string | null;
  [AllowedQueryParamsCommon.SORT_DIRECTION]: SortDirection | null;
}

export const DEFAULT_SORT_DIRECTION = SortDirection.ASC as const;

export type TableItem = { [ROW_ID]: string } & {
  [k: string]: string | undefined;
};
