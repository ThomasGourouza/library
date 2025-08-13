import { TestBed } from '@angular/core/testing';

import { MymemoryApiService } from './mymemory-api.service';

describe('MymemoryApiService', () => {
  let service: MymemoryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MymemoryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
