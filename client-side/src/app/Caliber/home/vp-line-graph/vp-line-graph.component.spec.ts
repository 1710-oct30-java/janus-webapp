import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VpLineGraphComponent } from './vp-line-graph.component';

describe('VpLineGraphComponent', () => {
  let component: VpLineGraphComponent;
  let fixture: ComponentFixture<VpLineGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VpLineGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VpLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
