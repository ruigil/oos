import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicStreamComponent } from './public-stream.component';

describe('StartComponent', () => {
  let component: PublicStreamComponent;
  let fixture: ComponentFixture<PublicStreamComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ PublicStreamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicStreamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
