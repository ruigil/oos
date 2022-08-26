import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropTextDetailComponent } from './drop-text-detail.component';

describe('DropTextDetailComponent', () => {
  let component: DropTextDetailComponent;
  let fixture: ComponentFixture<DropTextDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropTextDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropTextDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
