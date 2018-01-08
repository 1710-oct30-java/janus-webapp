import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralFeedbackComponent } from './general-feedback.component';

describe('GeneralFeedbackComponent', () => {
  let component: GeneralFeedbackComponent;
  let fixture: ComponentFixture<GeneralFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
