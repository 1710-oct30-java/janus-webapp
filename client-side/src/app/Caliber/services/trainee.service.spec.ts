import { TestBed, inject } from '@angular/core/testing';

import { TraineeService } from './trainee.service';

describe('TraineeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TraineeService]
    });
  });

  it('should be created', inject([TraineeService], (service: TraineeService) => {
    expect(service).toBeTruthy();
  }));
});
