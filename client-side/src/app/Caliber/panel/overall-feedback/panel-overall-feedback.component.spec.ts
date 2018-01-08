import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelOverallFeedbackComponent } from './panel-overall-feedback.component';

describe('PanelOverallFeedbackComponent', () => {
  let component: PanelOverallFeedbackComponent;
  let fixture: ComponentFixture<PanelOverallFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelOverallFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelOverallFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
