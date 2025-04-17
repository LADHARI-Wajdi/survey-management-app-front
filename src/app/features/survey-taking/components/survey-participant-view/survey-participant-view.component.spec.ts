import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyParticipantViewComponent } from './survey-participant-view.component';

describe('SurveyParticipantViewComponent', () => {
  let component: SurveyParticipantViewComponent;
  let fixture: ComponentFixture<SurveyParticipantViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyParticipantViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyParticipantViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
