import { TestBed, inject } from '@angular/core/testing';

import { AssessmentService } from './assessment.service';

describe('AssessmentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AssessmentService]
    });
  });

  it('should be created', inject([AssessmentService], (service: AssessmentService) => {
    expect(service).toBeTruthy();
  }));
});
