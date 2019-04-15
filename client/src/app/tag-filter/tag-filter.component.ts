import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Tag } from '../model/tag';
import { TagFilterService } from '../services/tag-filter.service';

@Component({
  selector: 'oos-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {
  tagCount: number = 0;
  dropCount: number = 500;
  searchTerm: BehaviorSubject<string> = new BehaviorSubject("");
  tagsObs: Observable<Tag[]>;
  selectedTags: string[] = [];

  constructor(private tagFilterService: TagFilterService) {
  }

  ngOnInit() {
    this.tagsObs = this.tagFilterService.tags().pipe(map( tags =>  tags.map( t => ( {...t, selected: this.selectedTags.includes(t.name)} ) )));
  }

  selectTag(id) {
    if (!this.selectedTags.includes(id)) this.selectedTags.push(id);
    else this.selectedTags.splice(this.selectedTags.indexOf(id),1);
    this.tagFilterService.selectTag(this.selectedTags);
  }

  filterTags(event){
    this.searchTerm.next(event.detail.value);
  }

  tagIdentity( index, tag) {
      return tag.name;
  }

}
