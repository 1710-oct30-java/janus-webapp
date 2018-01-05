import { TestBed, inject } from '@angular/core/testing';

import { VpHomeSelectorService } from './vp-home-selector.service';

describe('VpHomeSelectorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VpHomeSelectorService]
    });
  });

  it('should be created', inject([VpHomeSelectorService], (service: VpHomeSelectorService) => {
    expect(service).toBeTruthy();
  }));
});
