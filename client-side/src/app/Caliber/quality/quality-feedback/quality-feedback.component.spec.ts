import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityFeedbackComponent } from './quality-feedback.component';

describe('QualityFeedbackComponent', () => {
  let component: QualityFeedbackComponent;
  let fixture: ComponentFixture<QualityFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
