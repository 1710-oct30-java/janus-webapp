import { TestBed, inject } from '@angular/core/testing';

import { VpHomeLineGraphService } from './vp-home-line-graph.service';

describe('VpHomeLineGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VpHomeLineGraphService]
    });
  });

  it('should be created', inject([VpHomeLineGraphService], (service: VpHomeLineGraphService) => {
    expect(service).toBeTruthy();
  }));
});
