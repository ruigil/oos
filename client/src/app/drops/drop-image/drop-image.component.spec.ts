import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropImageComponent } from './drop-image.component';

describe('DropImageComponent', () => {
  let component: DropImageComponent;
  let fixture: ComponentFixture<DropImageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropImageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
