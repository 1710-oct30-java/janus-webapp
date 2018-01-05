import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePanelComponent } from './create-panel.component';

describe('CreatePanelComponent', () => {
  let component: CreatePanelComponent;
  let fixture: ComponentFixture<CreatePanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
