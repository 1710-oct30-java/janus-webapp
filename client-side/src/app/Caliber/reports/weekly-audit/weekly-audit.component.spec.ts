import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeeklyAuditComponent } from './weekly-audit.component';

describe('WeeklyAuditComponent', () => {
  let component: WeeklyAuditComponent;
  let fixture: ComponentFixture<WeeklyAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeeklyAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeeklyAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
