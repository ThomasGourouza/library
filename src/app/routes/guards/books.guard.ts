import { inject } from '@angular/core';
import { CanActivateFn, Params, Router } from '@angular/router';
import {
  ALLOWED_BOOK_QUERY_PARAMS,
  ALLOWED_SORT_DIRECTIONS,
  BOOKS_HEADERS,
  DEFAULT_BOOK_SORT_COLUMN,
  DEFAULT_SORT_DIRECTION,
  SortDirection,
} from '@constants';

export const booksGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);

  const original = route.queryParams;
  const filtered: Params = {};

  for (const key of ALLOWED_BOOK_QUERY_PARAMS) {
    if (Object.prototype.hasOwnProperty.call(original, key)) {
      filtered[key] = original[key];
    }
  }

  const colRaw = original['sortColumn'] as string | undefined;
  const dirRaw = (
    original['sortDirection'] as string | undefined
  )?.toLowerCase();

  const colValid =
    colRaw && BOOKS_HEADERS.map(({ name }) => name).includes(colRaw as any);
  const dirValid = dirRaw && ALLOWED_SORT_DIRECTIONS.includes(dirRaw as any);

  let sortColumn = colValid ? colRaw : undefined;
  let sortDirection = dirValid ? (dirRaw as SortDirection) : undefined;

  if (colRaw && dirRaw) {
    if (!colValid) sortColumn = DEFAULT_BOOK_SORT_COLUMN;
    if (!dirValid) sortDirection = DEFAULT_SORT_DIRECTION;
  }

  if (colRaw && !dirRaw) {
    sortColumn = colValid ? colRaw : DEFAULT_BOOK_SORT_COLUMN;
    sortDirection = DEFAULT_SORT_DIRECTION;
  }
  if (!colRaw && dirRaw) {
    sortColumn = DEFAULT_BOOK_SORT_COLUMN;
    sortDirection = dirValid ? (dirRaw as any) : DEFAULT_SORT_DIRECTION;
  }

  if (sortColumn) filtered['sortColumn'] = sortColumn;
  if (sortDirection) filtered['sortDirection'] = sortDirection;

  const differentKeyCount =
    Object.keys(original).length !== Object.keys(filtered).length;

  const differentValue = ALLOWED_BOOK_QUERY_PARAMS.some(
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
