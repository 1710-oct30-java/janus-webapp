import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TraineeTechSkillsComponent } from './trainee-tech-skills.component';

describe('TraineeTechSkillsComponent', () => {
  let component: TraineeTechSkillsComponent;
  let fixture: ComponentFixture<TraineeTechSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TraineeTechSkillsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TraineeTechSkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
