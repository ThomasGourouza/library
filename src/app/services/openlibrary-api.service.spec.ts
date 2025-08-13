import { TestBed } from '@angular/core/testing';

import { OpenlibraryApiService } from './openlibrary-api.service';

describe('OpenlibraryApiService', () => {
  let service: OpenlibraryApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OpenlibraryApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
