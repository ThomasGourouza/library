import { TestBed } from '@angular/core/testing';

import { BookTableMappingService } from './book-table-mapping.service';

describe('BookTableMappingService', () => {
  let service: BookTableMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookTableMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
