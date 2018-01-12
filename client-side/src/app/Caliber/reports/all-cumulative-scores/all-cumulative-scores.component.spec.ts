import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCumulativeScoresComponent } from './all-cumulative-scores.component';

describe('WeeklyLineChartComponent', () => {
  let component: AllCumulativeScoresComponent;
  let fixture: ComponentFixture<AllCumulativeScoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCumulativeScoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCumulativeScoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
