import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropNoteComponent } from './drop-note.component';

describe('DropNoteComponent', () => {
  let component: DropNoteComponent;
  let fixture: ComponentFixture<DropNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DropNoteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DropNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
