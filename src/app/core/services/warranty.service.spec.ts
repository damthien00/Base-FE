/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WarrantyService } from './warranty.service';

describe('Service: Warranty', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WarrantyService]
    });
  });

  it('should ...', inject([WarrantyService], (service: WarrantyService) => {
    expect(service).toBeTruthy();
  }));
});
