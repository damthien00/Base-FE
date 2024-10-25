/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WarrantyClaimsService } from './warranty-claims.service';

describe('Service: WarrantyClaims', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarrantyClaimsService]
    });
  });

  it('should ...', inject([WarrantyClaimsService], (service: WarrantyClaimsService) => {
    expect(service).toBeTruthy();
  }));
});
