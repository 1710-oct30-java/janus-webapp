import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyLineChartComponent } from './weekly-line-chart.component';

describe('WeeklyLineChartComponent', () => {
  let component: WeeklyLineChartComponent;
  let fixture: ComponentFixture<WeeklyLineChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyLineChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyLineChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
