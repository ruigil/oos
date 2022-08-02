import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoneyDetailComponent } from './money-detail.component';

describe('TransactionDetailComponent', () => {
  let component: MoneyDetailComponent;
  let fixture: ComponentFixture<MoneyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoneyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoneyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
