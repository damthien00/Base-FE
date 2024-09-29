import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarrantyLookupComponent } from './warranty-lookup.component';

describe('WarrantyLookupComponent', () => {
  let component: WarrantyLookupComponent;
  let fixture: ComponentFixture<WarrantyLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarrantyLookupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WarrantyLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
