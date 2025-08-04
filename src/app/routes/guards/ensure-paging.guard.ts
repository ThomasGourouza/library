import { inject } from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UtilsService } from 'app/services/utils.service';

export const ensurePagingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const utilsService = inject(UtilsService);

  const { page, rows, ...rest } = route.queryParams;
  if (
    utilsService.isCorrectPage(page) &&
    utilsService.isCorrectRowsLimit(rows)
  ) {
    return true;
  }

  return router.createUrlTree([], {
    queryParams: {
      page: utilsService.toCorrectPage(page),
      rows: utilsService.toCorrectRowsLimit(rows),
      ...rest,
    },
  });
};
