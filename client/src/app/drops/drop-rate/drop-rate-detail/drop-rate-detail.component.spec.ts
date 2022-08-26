import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DropRateDetailComponent } from './drop-rate-detail.component';

describe('DropRateDetailComponent', () => {
  let component: DropRateDetailComponent;
  let fixture: ComponentFixture<DropRateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DropRateDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropRateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
