import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionStatisticsComponent } from './question-statistics.component';

describe('QuestionStatisticsComponent', () => {
  let component: QuestionStatisticsComponent;
  let fixture: ComponentFixture<QuestionStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
