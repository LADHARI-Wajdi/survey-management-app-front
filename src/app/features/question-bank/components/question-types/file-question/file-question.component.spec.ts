import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileQuestionComponent } from './file-question.component';

describe('FileQuestionComponent', () => {
  let component: FileQuestionComponent;
  let fixture: ComponentFixture<FileQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
