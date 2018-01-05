import { TestBed, inject } from '@angular/core/testing';

import { EvaluationService } from './evaluation.service';

describe('EvaluationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EvaluationService]
    });
  });

  it('should be created', inject([EvaluationService], (service: EvaluationService) => {
    expect(service).toBeTruthy();
  }));
});
