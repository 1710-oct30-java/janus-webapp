import { TestBed, inject } from '@angular/core/testing';

import { VpHomePanelGraphService } from './vp-home-panel-graph.service';

describe('VpHomePanelGraphService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VpHomePanelGraphService]
    });
  });

  it('should be created', inject([VpHomePanelGraphService], (service: VpHomePanelGraphService) => {
    expect(service).toBeTruthy();
  }));
});
