import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchReceivingComponent } from './branch-receiving.component';

describe('BranchReceivingComponent', () => {
  let component: BranchReceivingComponent;
  let fixture: ComponentFixture<BranchReceivingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchReceivingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BranchReceivingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
