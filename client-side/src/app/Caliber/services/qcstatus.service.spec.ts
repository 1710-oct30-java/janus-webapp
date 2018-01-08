import { TestBed, inject } from '@angular/core/testing';

import { QcstatusService } from './qcstatus.service';

describe('QcstatusService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QcstatusService]
    });
  });

  it('should be created', inject([QcstatusService], (service: QcstatusService) => {
    expect(service).toBeTruthy();
  }));
});
