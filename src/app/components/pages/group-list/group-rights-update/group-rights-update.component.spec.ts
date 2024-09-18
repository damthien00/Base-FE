import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRightsUpdateComponent } from './group-rights-update.component';

describe('GroupRightsUpdateComponent', () => {
  let component: GroupRightsUpdateComponent;
  let fixture: ComponentFixture<GroupRightsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupRightsUpdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupRightsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
