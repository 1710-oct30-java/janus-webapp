import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CumulativeScoreComponent } from './cumulative-scores.component';

describe('ToolbarComponent', () => {
  let component: CumulativeScoreComponent;
  let fixture: ComponentFixture<CumulativeScoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CumulativeScoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CumulativeScoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
