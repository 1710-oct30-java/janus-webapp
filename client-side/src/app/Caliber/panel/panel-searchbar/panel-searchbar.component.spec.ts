import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelSearchbarComponent } from './panel-searchbar.component';

describe('PanelSearchbarComponent', () => {
  let component: PanelSearchbarComponent;
  let fixture: ComponentFixture<PanelSearchbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PanelSearchbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PanelSearchbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
