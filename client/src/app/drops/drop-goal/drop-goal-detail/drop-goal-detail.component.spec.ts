import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropGoalDetailComponent } from './drop-goal-detail.component';

describe('DropGoalDetailComponent', () => {
  let component: DropGoalDetailComponent;
  let fixture: ComponentFixture<DropGoalDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropGoalDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropGoalDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
