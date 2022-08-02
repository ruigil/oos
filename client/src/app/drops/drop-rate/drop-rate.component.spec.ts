import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropRateComponent } from './drop-rate.component';

describe('DropRateComponent', () => {
  let component: DropRateComponent;
  let fixture: ComponentFixture<DropRateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropRateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
