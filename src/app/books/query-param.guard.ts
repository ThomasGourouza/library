import { inject } from '@angular/core';
import { CanActivateFn, Params, Router } from '@angular/router';

const ALLOWED_QUERY_PARAMS = [
  'id',
  'title',
  'author',
  'year',
  'genre',
  'test',
  'sortColumn',
  'sortDirection',
  'page',
] as const;

const ALLOWED_SORT_COLUMNS = [
  'id',
  'title',
  'author',
  'year',
  'genre',
  'test',
] as const;
const ALLOWED_SORT_DIRECTIONS = ['asc', 'desc'] as const;
const DEFAULT_SORT_COLUMN = 'title';
const DEFAULT_SORT_DIRECTION = 'asc';

export const queryParamGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);

  const original = route.queryParams;
  const filtered: Params = {};

  for (const key of ALLOWED_QUERY_PARAMS) {
    if (Object.prototype.hasOwnProperty.call(original, key)) {
      filtered[key] = original[key];
    }
  }

  const colRaw = original['sortColumn'] as string | undefined;
  const dirRaw = (
    original['sortDirection'] as string | undefined
  )?.toLowerCase();

  const colValid = colRaw && ALLOWED_SORT_COLUMNS.includes(colRaw as any);
  const dirValid = dirRaw && ALLOWED_SORT_DIRECTIONS.includes(dirRaw as any);

  let sortColumn = colValid ? colRaw : undefined;
  let sortDirection = dirValid ? (dirRaw as 'asc' | 'desc') : undefined;

  if (colRaw && dirRaw) {
    if (!colValid) sortColumn = DEFAULT_SORT_COLUMN;
    if (!dirValid) sortDirection = DEFAULT_SORT_DIRECTION;
  }

  if (colRaw && !dirRaw) {
    sortColumn = colValid ? colRaw : DEFAULT_SORT_COLUMN;
    sortDirection = DEFAULT_SORT_DIRECTION;
  }
  if (!colRaw && dirRaw) {
    sortColumn = DEFAULT_SORT_COLUMN;
    sortDirection = dirValid ? (dirRaw as any) : DEFAULT_SORT_DIRECTION;
  }

  if (sortColumn) filtered['sortColumn'] = sortColumn;
  if (sortDirection) filtered['sortDirection'] = sortDirection;

  const differentKeyCount =
    Object.keys(original).length !== Object.keys(filtered).length;

  const differentValue = ALLOWED_QUERY_PARAMS.some(
    (k) => original[k] !== filtered[k]
  );

  if (!differentKeyCount && !differentValue) {
    return true;
  }

  return router.createUrlTree([], {
    queryParams: filtered,
    queryParamsHandling: '',
    preserveFragment: true,
  });
};
