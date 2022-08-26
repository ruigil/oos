import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropTaskDetailComponent } from './drop-task-detail.component';

describe('DropTaskDetailComponent', () => {
  let component: DropTaskDetailComponent;
  let fixture: ComponentFixture<DropTaskDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropTaskDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropTaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
