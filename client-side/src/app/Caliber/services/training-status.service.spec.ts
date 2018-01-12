import { TestBed, inject } from '@angular/core/testing';

import { TrainingStatusService } from './training-status.service';

describe('TrainingStatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingStatusService]
    });
  });

  it('should be created', inject([TrainingStatusService], (service: TrainingStatusService) => {
    expect(service).toBeTruthy();
  }));
});
