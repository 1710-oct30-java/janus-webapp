import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyGradesComponent } from './weekly-grades.component';

describe('WeeklyGradesComponent', () => {
  let component: WeeklyGradesComponent;
  let fixture: ComponentFixture<WeeklyGradesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyGradesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyGradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
