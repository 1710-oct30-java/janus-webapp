import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyFeedbackComponent } from './weekly-feedback.component';

describe('WeeklyFeedbackComponent', () => {
  let component: WeeklyFeedbackComponent;
  let fixture: ComponentFixture<WeeklyFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
