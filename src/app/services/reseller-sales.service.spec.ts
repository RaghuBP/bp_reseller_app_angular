import { TestBed } from '@angular/core/testing';

import { ResellerSalesService } from './reseller-sales.service';

describe('ResellerSalesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResellerSalesService = TestBed.get(ResellerSalesService);
    expect(service).toBeTruthy();
  });
});
