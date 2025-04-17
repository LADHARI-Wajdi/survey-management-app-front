import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { surveyAccessGuard } from './survey-access.guard';

describe('surveyAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => surveyAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
