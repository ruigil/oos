import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsStatsComponent } from './tags-stats.component';

describe('TagsStatsComponent', () => {
  let component: TagsStatsComponent;
  let fixture: ComponentFixture<TagsStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
