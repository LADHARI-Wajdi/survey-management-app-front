import { TestBed } from '@angular/core/testing';

import { SurveyProgressService } from './survey-progress.service';

describe('SurveyProgressService', () => {
  let service: SurveyProgressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyProgressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
