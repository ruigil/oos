import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamsComponent } from './streams.component';

describe('TagssComponent', () => {
  let component: StreamsComponent;
  let fixture: ComponentFixture<StreamsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StreamsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
