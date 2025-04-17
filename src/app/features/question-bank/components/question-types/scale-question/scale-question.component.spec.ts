import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScaleQuestionComponent } from './scale-question.component';

describe('ScaleQuestionComponent', () => {
  let component: ScaleQuestionComponent;
  let fixture: ComponentFixture<ScaleQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScaleQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScaleQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
