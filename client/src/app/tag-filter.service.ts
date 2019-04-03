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
        const dropsObs = tags.length > 0 ? 
            this.fireService.colWithIds$("drops", ref => ref.where("tags","array-contains",tags[0]).orderBy("date","desc")) :
            this.fireService.colWithIds$("drops", ref => ref.orderBy("date","desc"));
        // local filter by the selected tags.
        return dropsObs.pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )));
    }));

    this.tags$ = this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc'));

}

  selectTag(tags: string[]) {
    this.selectedTags$.next(tags);
  }

  selectTimeFrame( value: string) {
      console.log(value);
  }

  tags():Observable<Tag[]> {
    return combineLatest(this.tags$,this.drops$).pipe( map( ([tags,drops]) => {
      // filter the tags that are contained in a least one those drops.
      return tags.filter( t => drops.some( d => d.tags.includes(t.name)) );
    }) );
  }

  drops():Observable<Drop[]> {
    return this.drops$;
  }
}
