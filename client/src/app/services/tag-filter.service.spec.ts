import { TestBed } from '@angular/core/testing';

import { TagFilterService } from './tag-filter.service';

describe('TagFilterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TagFilterService = TestBed.get(TagFilterService);
    expect(service).toBeTruthy();
  });
});
