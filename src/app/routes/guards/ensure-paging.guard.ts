import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { AllowedQueryParamsCommon } from 'app/models/types';
import { UtilsService } from 'app/services/utils.service';

export const ensurePagingGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const router = inject(Router);
  const utilsService = inject(UtilsService);

  const {
    [AllowedQueryParamsCommon.PAGE]: page,
    [AllowedQueryParamsCommon.ROWS_LIMIT]: rowsLimit,
    ...rest
  } = route.queryParams;
  if (
    utilsService.isCorrectPage(page) &&
    utilsService.isCorrectRowsLimit(rowsLimit)
  ) {
    return true;
  }

  return router.createUrlTree([], {
    queryParams: {
      [AllowedQueryParamsCommon.PAGE]: utilsService.toCorrectPage(page),
      [AllowedQueryParamsCommon.ROWS_LIMIT]:
        utilsService.toCorrectRowsLimit(rowsLimit),
      ...rest,
    },
  });
};
