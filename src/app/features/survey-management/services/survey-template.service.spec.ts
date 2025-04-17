import { TestBed } from '@angular/core/testing';

import { SurveyTemplateService } from './survey-template.service';

describe('SurveyTemplateService', () => {
  let service: SurveyTemplateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurveyTemplateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
