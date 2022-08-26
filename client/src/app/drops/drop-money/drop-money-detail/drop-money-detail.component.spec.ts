import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropMoneyDetailComponent } from './drop-money-detail.component';

describe('DropMoneyDetailComponent', () => {
  let component: DropMoneyDetailComponent;
  let fixture: ComponentFixture<DropMoneyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropMoneyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropMoneyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
