export enum AllowedQueryParamsCommon {
  PAGE = 'page',
  ROWS_LIMIT = 'rows',
  SORT_COLUMN = 'sort_column',
  SORT_DIRECTION = 'sort_direction',
}

export enum Between {
  MIN = '_min',
  MAX = '_max',
}

export const DEFAULT_PAGE = 1;
export const ROWS_LIMIT_LIST = [5, 10, 15, 20, 30, 50, 100];
export const DEFAULT_ROWS_LIMIT = ROWS_LIMIT_LIST[2];
export const DEFAULT_QUERY_PARAMS = {
  [AllowedQueryParamsCommon.PAGE]: DEFAULT_PAGE,
  [AllowedQueryParamsCommon.ROWS_LIMIT]: DEFAULT_ROWS_LIMIT,
} as const;

export function toAllowedFilterParamsKeys(list: Header[]) {
  return list.flatMap(({ name, type }) =>
    type === HeaderType.NUMBER
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

export enum HeaderType {
  TEXT = 'text',
  NUMBER = 'number',
}

export type Header = {
  name: string;
  label: string;
  type: HeaderType;
  isVisible: boolean;
  hasSelect: boolean;
  isSelectAdd: boolean;
  sortDirection: SortDirection | null;
  rank: number;
};

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortParams {
  [AllowedQueryParamsCommon.SORT_COLUMN]: string | null;
  [AllowedQueryParamsCommon.SORT_DIRECTION]: SortDirection | null;
}

export const DEFAULT_SORT_DIRECTION = SortDirection.ASC as const;

export type TableItem = { id: string } & {
  [k: string]: string | undefined;
};

export const COLUMN_SETTINGS_KEY = 'columnSettings' as const;
