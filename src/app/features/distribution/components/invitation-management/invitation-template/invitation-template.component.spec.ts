import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationTemplateComponent } from './invitation-template.component';

describe('InvitationTemplateComponent', () => {
  let component: InvitationTemplateComponent;
  let fixture: ComponentFixture<InvitationTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
