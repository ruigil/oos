import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropImageDetailComponent } from './drop-image-detail.component';

describe('DropImageDetailComponent', () => {
  let component: DropImageDetailComponent;
  let fixture: ComponentFixture<DropImageDetailComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ DropImageDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DropImageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
