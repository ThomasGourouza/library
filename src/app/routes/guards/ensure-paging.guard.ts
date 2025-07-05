import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@shared/constants';

export const ensurePagingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);

  const { page, page_limit, ...rest } = route.queryParams;
  if (page !== undefined && page_limit !== undefined) {
    return true;
  }
  return router.createUrlTree([], {
    queryParams: {
      page: page ?? DEFAULT_PAGE,
      page_limit: page_limit ?? DEFAULT_PAGE_LIMIT,
      ...rest,
    },
  });
};
