import { TestBed } from '@angular/core/testing';

import { DeliverystaffService } from './deliverystaff.service';

describe('DeliverystaffService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeliverystaffService = TestBed.get(DeliverystaffService);
    expect(service).toBeTruthy();
  });
});
