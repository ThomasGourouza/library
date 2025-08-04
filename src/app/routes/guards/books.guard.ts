import { CanActivateFn, Params, Router } from '@angular/router';
import { inject } from '@angular/core';
import {
  DEFAULT_SORT_DIRECTION,
  AllowedQueryParamsCommon,
  SortDirection,
} from '@shared/constants';
import { ALLOWED_BOOK_QUERY_PARAMS_KEYS } from 'app/services/book.service';
import { BOOKS_HEADERS } from 'app/models/book';

export const booksGuard: CanActivateFn = (route, _state) => {
  const router = inject(Router);

  const queryParams = route.queryParams;
  const filtered: Params = {};

  for (const key of ALLOWED_BOOK_QUERY_PARAMS_KEYS) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key)) {
      filtered[key] = queryParams[key];
    }
  }

  const sortColumnValueFromUrl =
    queryParams[AllowedQueryParamsCommon.SORT_COLUMN];
  const sortDirectionValueFromUrl = queryParams[
    AllowedQueryParamsCommon.SORT_DIRECTION
  ]?.toLowerCase() as SortDirection;

  const isSortColumnValid =
    sortColumnValueFromUrl &&
    BOOKS_HEADERS.map(({ name }) => name).includes(sortColumnValueFromUrl);
  const isSortDirectionValid =
    sortDirectionValueFromUrl &&
    Object.values(SortDirection).includes(sortDirectionValueFromUrl);

  filtered[AllowedQueryParamsCommon.SORT_COLUMN] = isSortColumnValid
    ? sortColumnValueFromUrl
    : null;
  filtered[AllowedQueryParamsCommon.SORT_DIRECTION] = isSortColumnValid
    ? isSortDirectionValid
      ? sortDirectionValueFromUrl
      : DEFAULT_SORT_DIRECTION
    : null;

  const newQueryParams = Object.fromEntries(
    Object.entries(filtered).filter(([, value]) => value !== null)
  );

  const differentKeyCount =
    Object.keys(queryParams).length !== Object.keys(newQueryParams).length;

  const differentValue = ALLOWED_BOOK_QUERY_PARAMS_KEYS.some(
    (k) => queryParams[k] !== newQueryParams[k]
  );

  if (!differentKeyCount && !differentValue) {
    return true;
  }

  return router.createUrlTree([], {
    queryParams: newQueryParams,
    queryParamsHandling: '',
    preserveFragment: true,
  });
};
