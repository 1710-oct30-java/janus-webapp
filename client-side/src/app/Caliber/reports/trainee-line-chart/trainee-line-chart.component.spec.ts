import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeLineChartComponent } from './trainee-line-chart.component';

describe('TraineeLineChartComponent', () => {
  let component: TraineeLineChartComponent;
  let fixture: ComponentFixture<TraineeLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraineeLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
