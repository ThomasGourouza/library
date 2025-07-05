import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ensurePagingGuard } from './ensure-paging.guard';

describe('ensurePagingGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ensurePagingGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
