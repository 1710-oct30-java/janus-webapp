import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlocationComponent } from './editlocation.component';

describe('EditlocationComponent', () => {
  let component: EditlocationComponent;
  let fixture: ComponentFixture<EditlocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditlocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
