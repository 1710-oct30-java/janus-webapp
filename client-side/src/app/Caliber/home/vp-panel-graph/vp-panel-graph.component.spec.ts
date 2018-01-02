import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpPanelGraphComponent } from './vp-panel-graph.component';

describe('VpPanelGraphComponent', () => {
  let component: VpPanelGraphComponent;
  let fixture: ComponentFixture<VpPanelGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpPanelGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpPanelGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
