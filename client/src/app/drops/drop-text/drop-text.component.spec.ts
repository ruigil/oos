import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropTextComponent } from './drop-text.component';

describe('DropTextComponent', () => {
  let component: DropTextComponent;
  let fixture: ComponentFixture<DropTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
