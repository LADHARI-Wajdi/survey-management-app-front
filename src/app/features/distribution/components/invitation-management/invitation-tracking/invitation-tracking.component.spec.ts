import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationTrackingComponent } from './invitation-tracking.component';

describe('InvitationTrackingComponent', () => {
  let component: InvitationTrackingComponent;
  let fixture: ComponentFixture<InvitationTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
