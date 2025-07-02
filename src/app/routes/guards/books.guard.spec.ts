import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { booksGuard } from './books.guard';

describe('booksGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => booksGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
