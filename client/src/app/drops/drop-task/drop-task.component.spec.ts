import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropTaskComponent } from './drop-task.component';

describe('DropTaskComponent', () => {
  let component: DropTaskComponent;
  let fixture: ComponentFixture<DropTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropTaskComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
