import { TestBed, inject } from '@angular/core/testing';

import { VpHomeBarGraphService } from './vp-home-bar-graph.service';

describe('VpHomeBarGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VpHomeBarGraphService]
    });
  });

  it('should be created', inject([VpHomeBarGraphService], (service: VpHomeBarGraphService) => {
    expect(service).toBeTruthy();
  }));
});
