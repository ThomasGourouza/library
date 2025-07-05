import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UtilsService } from 'app/services/utils.service';

export const ensurePagingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const utilsService = inject(UtilsService);

  const { page, page_limit, ...rest } = route.queryParams;
  if (
    utilsService.isCorrectPage(page) &&
    utilsService.isCorrectPageLimit(page_limit)
  ) {
    return true;
  }

  return router.createUrlTree([], {
    queryParams: {
      page: utilsService.toCorrectPage(page),
      page_limit: utilsService.toCorrectPageLimit(page_limit),
      ...rest,
    },
  });
};
