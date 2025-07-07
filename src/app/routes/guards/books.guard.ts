import { CanActivateFn, Params, Router } from '@angular/router';
import { inject } from '@angular/core';
import { DEFAULT_SORT_DIRECTION, SortDirection } from '@shared/constants';
import {
  ALLOWED_BOOK_QUERY_PARAMS_KEYS,
  BOOKS_HEADERS,
  BOOK_MANDATORY_COLUMN,
} from 'app/services/book.service';

export const booksGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);

  const queryParams = route.queryParams;
  const filtered: Params = {};

  for (const key of ALLOWED_BOOK_QUERY_PARAMS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      filtered[key] = queryParams[key];
    }
  }

  const colRaw = queryParams['sortColumn'] as string | undefined;
  const dirRaw = (
    queryParams['sortDirection'] as string | undefined
  )?.toLowerCase();

  const colValid =
    colRaw && BOOKS_HEADERS.map(({ name }) => name).includes(colRaw);
  const dirValid =
    dirRaw && Object.values(SortDirection).map(toString).includes(dirRaw);

  let sortColumn = colValid ? colRaw : undefined;
  let sortDirection = dirValid ? (dirRaw as SortDirection) : undefined;

  if (colRaw && dirRaw) {
    if (!colValid) sortColumn = BOOK_MANDATORY_COLUMN;
    if (!dirValid) sortDirection = DEFAULT_SORT_DIRECTION;
  }

  if (colRaw && !dirRaw) {
    sortColumn = colValid ? colRaw : BOOK_MANDATORY_COLUMN;
    sortDirection = DEFAULT_SORT_DIRECTION;
  }
  if (!colRaw && dirRaw) {
    sortColumn = BOOK_MANDATORY_COLUMN;
    sortDirection = dirValid
      ? (dirRaw as SortDirection)
      : DEFAULT_SORT_DIRECTION;
  }

  if (sortColumn) filtered['sortColumn'] = sortColumn;
  if (sortDirection) filtered['sortDirection'] = sortDirection;

  const differentKeyCount =
    Object.keys(queryParams).length !== Object.keys(filtered).length;

  const differentValue = ALLOWED_BOOK_QUERY_PARAMS_KEYS.some(
    (k) => queryParams[k] !== filtered[k]
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
