import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveySettingsComponent } from './survey-settings.component';

describe('SurveySettingsComponent', () => {
  let component: SurveySettingsComponent;
  let fixture: ComponentFixture<SurveySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveySettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
