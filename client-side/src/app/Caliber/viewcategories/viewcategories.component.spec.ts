import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcategoriesComponent } from './viewcategories.component';

describe('ViewcategoriesComponent', () => {
  let component: ViewcategoriesComponent;
  let fixture: ComponentFixture<ViewcategoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewcategoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
