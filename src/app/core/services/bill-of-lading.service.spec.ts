import { TestBed } from '@angular/core/testing';

import { BillOfLadingService } from '../../bill-of-lading.service';

describe('BillOfLadingService', () => {
  let service: BillOfLadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillOfLadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
