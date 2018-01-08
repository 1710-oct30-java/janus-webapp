import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QcDoughnutComponent } from './qc-doughnut.component';

describe('QcDoughnutComponent', () => {
  let component: QcDoughnutComponent;
  let fixture: ComponentFixture<QcDoughnutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QcDoughnutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QcDoughnutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
