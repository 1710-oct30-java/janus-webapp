import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalFeedbackComponent } from './technical-feedback.component';

describe('TechnicalFeedbackComponent', () => {
  let component: TechnicalFeedbackComponent;
  let fixture: ComponentFixture<TechnicalFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
