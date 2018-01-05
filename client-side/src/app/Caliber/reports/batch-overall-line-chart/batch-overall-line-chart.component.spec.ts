import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchOverallLineChartComponent } from './batch-overall-line-chart.component';

describe('BatchOverallLineChartComponent', () => {
  let component: BatchOverallLineChartComponent;
  let fixture: ComponentFixture<BatchOverallLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BatchOverallLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchOverallLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
