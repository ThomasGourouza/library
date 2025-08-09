import { TestBed } from '@angular/core/testing';

import { BookMappingService } from './book-mapping.service';

describe('BookMappingService', () => {
  let service: BookMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
