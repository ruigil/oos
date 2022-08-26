import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OOSSkinComponent } from './oos-skin.component';

describe('OOSSkinComponent', () => {
  let component: OOSSkinComponent;
  let fixture: ComponentFixture<OOSSkinComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ OOSSkinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OOSSkinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
