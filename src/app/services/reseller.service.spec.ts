import { TestBed } from '@angular/core/testing';

import { ResellerService } from './reseller.service';

describe('ResellerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResellerService = TestBed.get(ResellerService);
    expect(service).toBeTruthy();
  });
});
