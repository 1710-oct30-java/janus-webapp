import { TestBed, inject } from '@angular/core/testing';

import { TrainingTypeService } from './training-type.service';

describe('TrainingTypeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrainingTypeService]
    });
  });

  it('should be created', inject([TrainingTypeService], (service: TrainingTypeService) => {
    expect(service).toBeTruthy();
  }));
});
