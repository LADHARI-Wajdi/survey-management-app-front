import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestigatorDashboardComponent } from './investigator-dashboard.component';

describe('InvestigatorDashboardComponent', () => {
  let component: InvestigatorDashboardComponent;
  let fixture: ComponentFixture<InvestigatorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestigatorDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestigatorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
