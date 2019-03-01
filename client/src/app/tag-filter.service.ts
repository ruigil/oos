import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { Drop } from "./drop";
import { Tag } from "./tag";
import { FireService } from './fire.service';

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  //dropsObservable = new Subject<Drop[]>();
  //tagsObservable = new Subject<Tag[]>();
  drops$: Observable<Drop[]>;
  tags$: Observable<Tag[]>;
  //allTags:Tag[];
  selectedTags$: BehaviorSubject<string[]> = new BehaviorSubject([]);

  constructor(private fireService: FireService) {
    this.drops$ = this.selectedTags$.pipe( flatMap( tags => {
      console.log("selecting drops with tags: "+tags)
      return tags.length > 0 ? 
        this.fireService.colWithIds$("drops", ref => ref.where("tags","array-contains",tags[0]).orderBy("updatedAt","asc")) :
        this.fireService.colWithIds$("drops", ref => ref.orderBy("updatedAt","asc"));
    }));

    this.tags$ = this.fireService.colWithIds$("tags");

}

  selectTag(tags: string[]) {
    this.selectedTags$.next(tags);
  }

  tags():Observable<Tag[]> {
    return combineLatest(this.tags$,this.drops$, this.selectedTags$).pipe( map( ([tags,drops,selected]) => {
      // filter the drops that contains all the selected tags, and then filter the tags that are contained in a least one those drops.
      return tags.filter( t => drops.filter( d => selected.every(t => d.tags.includes(t),this) ).some( d => d.tags.includes(t.name)) )
    }) );
  }

  drops():Observable<Drop[]> {
    // combine the latest drops, and filter by the selected tags.
    return combineLatest(this.drops$,this.selectedTags$).pipe( map( ([drops,selected]) => drops.filter( d => selected.every(t => d.tags.includes(t),this) )) );
  }
}
