import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelBatchAllTraineesComponent } from './panel-batch-all-trainees.component';

describe('PanelBatchAllTraineesComponent', () => {
  let component: PanelBatchAllTraineesComponent;
  let fixture: ComponentFixture<PanelBatchAllTraineesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelBatchAllTraineesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelBatchAllTraineesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
