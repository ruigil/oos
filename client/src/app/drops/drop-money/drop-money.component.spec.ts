import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropMoneyComponent } from './drop-money.component';

describe('DropMoneyComponent', () => {
  let component: DropMoneyComponent;
  let fixture: ComponentFixture<DropMoneyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropMoneyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropMoneyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
