import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropGoalComponent } from './drop-goal.component';

describe('DropGoalComponent', () => {
  let component: DropGoalComponent;
  let fixture: ComponentFixture<DropGoalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropGoalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
