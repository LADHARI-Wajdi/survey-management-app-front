import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateQuestionComponent } from './date-question.component';

describe('DateQuestionComponent', () => {
  let component: DateQuestionComponent;
  let fixture: ComponentFixture<DateQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DateQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
