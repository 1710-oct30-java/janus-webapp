import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverallFeedbackComponent } from './overall-feedback.component';

describe('OverallFeedbackComponent', () => {
  let component: OverallFeedbackComponent;
  let fixture: ComponentFixture<OverallFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverallFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverallFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
