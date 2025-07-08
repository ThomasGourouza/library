import { CanActivateFn, Params, Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  DEFAULT_SORT_DIRECTION,
  AllowedQueryParamsCommon,
  SortDirection,
} from '@shared/constants';
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

  const colRaw = queryParams[AllowedQueryParamsCommon.SORT_COLUMN] as
    | string
    | null;
  const dirRaw = (
    queryParams[AllowedQueryParamsCommon.SORT_DIRECTION] as string | null
  )?.toLowerCase();

  const colValid =
    colRaw && BOOKS_HEADERS.map(({ name }) => name).includes(colRaw);
  const dirValid =
    dirRaw && Object.values(SortDirection).map(toString).includes(dirRaw);

  let sortColumnValue = colValid ? colRaw : null;
  let sortDirectionValue = dirValid ? (dirRaw as SortDirection) : null;

  if (colRaw && dirRaw) {
    if (!colValid) sortColumnValue = BOOK_MANDATORY_COLUMN;
    if (!dirValid) sortDirectionValue = DEFAULT_SORT_DIRECTION;
  }

  if (colRaw && !dirRaw) {
    sortColumnValue = colValid ? colRaw : BOOK_MANDATORY_COLUMN;
    sortDirectionValue = DEFAULT_SORT_DIRECTION;
  }
  if (!colRaw && dirRaw) {
    sortColumnValue = BOOK_MANDATORY_COLUMN;
    sortDirectionValue = dirValid
      ? (dirRaw as SortDirection)
      : DEFAULT_SORT_DIRECTION;
  }

  if (sortColumnValue)
    filtered[AllowedQueryParamsCommon.SORT_COLUMN] = sortColumnValue;
  if (sortDirectionValue)
    filtered[AllowedQueryParamsCommon.SORT_DIRECTION] = sortDirectionValue;

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
