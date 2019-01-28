import { TestBed, inject } from '@angular/core/testing';

import { DropsService } from './drops.service';

describe('DropsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DropsService]
    });
  });

  it('should be created', inject([DropsService], (service: DropsService) => {
    expect(service).toBeTruthy();
  }));
});
