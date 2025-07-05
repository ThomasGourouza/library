import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { DEFAULT_PAGE, DEFAULT_PAGE_LIMIT } from '@shared/constants';
import { UtilsService } from 'app/services/utils.service';

export const ensurePagingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const utilsService = inject(UtilsService);

  const { page, page_limit, ...rest } = route.queryParams;
  if (
    utilsService.toCorrectNumber(page) !== undefined &&
    utilsService.toCorrectNumber(page_limit) !== undefined
  ) {
    return true;
  }

  return router.createUrlTree([], {
    queryParams: {
      page: utilsService.toCorrectNumber(page) ?? DEFAULT_PAGE,
      page_limit:
        utilsService.toCorrectNumber(page_limit) ?? DEFAULT_PAGE_LIMIT,
      ...rest,
    },
  });
};
