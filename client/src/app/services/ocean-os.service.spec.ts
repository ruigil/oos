import { TestBed } from '@angular/core/testing';

import { OceanOSService } from './ocean-os.service';

describe('OceanOSService', () => {
  let service: OceanOSService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OceanOSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
