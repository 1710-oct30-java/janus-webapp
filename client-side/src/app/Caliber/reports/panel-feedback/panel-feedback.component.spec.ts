import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelFeedbackComponent } from './panel-feedback.component';

describe('PanelFeedbackComponent', () => {
  let component: PanelFeedbackComponent;
  let fixture: ComponentFixture<PanelFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
