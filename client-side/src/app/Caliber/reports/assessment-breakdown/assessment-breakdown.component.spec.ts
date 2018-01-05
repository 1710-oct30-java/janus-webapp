import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentBreakdownComponent } from './assessment-breakdown.component';

describe('AssessmentBreakdownComponent', () => {
  let component: AssessmentBreakdownComponent;
  let fixture: ComponentFixture<AssessmentBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
