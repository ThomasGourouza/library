import { TestBed } from '@angular/core/testing';

import { AuthorMappingService } from './author-mapping.service';

describe('AuthorMappingService', () => {
  let service: AuthorMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
