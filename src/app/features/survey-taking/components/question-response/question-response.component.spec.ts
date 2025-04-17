import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionResponseComponent } from './question-response.component';

describe('QuestionResponseComponent', () => {
  let component: QuestionResponseComponent;
  let fixture: ComponentFixture<QuestionResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionResponseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
