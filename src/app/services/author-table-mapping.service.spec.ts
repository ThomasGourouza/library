import { TestBed } from '@angular/core/testing';

import { AuthorTableMappingService } from './author-table-mapping.service';

describe('AuthorTableMappingService', () => {
  let service: AuthorTableMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorTableMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
