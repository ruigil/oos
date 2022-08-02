import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropSystemComponent } from './drop-system.component';

describe('DropSystemComponent', () => {
  let component: DropSystemComponent;
  let fixture: ComponentFixture<DropSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropSystemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
