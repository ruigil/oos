import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, Subscription, combineLatest } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';

import { Tag } from '../model/tag';
import { TagFilterService } from '../services/tag-filter.service';

@Component({
  selector: 'oos-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.scss']
})
export class TagFilterComponent implements OnInit, OnDestroy {
  tagCount: number = 0;
  dropCount: number = 500;
  searchTerm: BehaviorSubject<string> = new BehaviorSubject("");
  tagsObs: Observable<Tag[]>;
  selectedTags: string[] = [];

  constructor(private tagFilterService: TagFilterService) {
  }

  ngOnInit() {
      console.log("tag filter init ");
      //(tagsObs | sortTag | searchTag:searchTerm | async )
    this.tagsObs = combineLatest(this.tagFilterService.tags().pipe(
        tap( t => console.log("tags in filter") ),
        map( tags =>  tags.map( t => ( {...t, selected: this.selectedTags.includes(t.name)} ) )),
        map( tags => tags.sort( (a,b) => a.selected && !b.selected ? -1 : !a.selected && b.selected ? 1 : 0))
    )
    ,this.searchTerm.asObservable())
    .pipe( map( ([tags, term]) => tags.filter( t => t.name.toUpperCase().includes(term.toUpperCase()) ) ));
  }
  

  selectTag(id) {
    if (!this.selectedTags.includes(id)) this.selectedTags.push(id);
    else this.selectedTags.splice(this.selectedTags.indexOf(id),1);
    this.tagFilterService.selectTag(this.selectedTags);
  }

  filterTags(event){
        this.searchTerm.next(event.target.value);
  }

  tagIdentity( index, tag) {
      return tag.name;
  }

  ngOnDestroy() {
      console.log("tag filter destroy ");
  }

}
