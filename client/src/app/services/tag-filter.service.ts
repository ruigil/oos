import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, flatMap, filter, tap } from 'rxjs/operators';

import { FireService } from '../services/fire.service';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  drops$: Observable<Drop[]>;
  skeys: Array<any> = [{},{},{}];
  sidx: number = 0;
  tags$: Observable<Tag[]>;
  selectedTags$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  startPage$: Subject<any> = new Subject();

  constructor(private fireService: FireService) {
    this.drops$ = combineLatest(this.selectedTags$,this.startPage$).pipe( flatMap( ([tags,page]) => {
            ////console.log(tags);
            //console.log(ts);
            //console.log(sa);
        return tags.length > 0 ? 
            this.fireService.colWithIds$("drops", ref => ref.where("date","<=",page.startAt).where("tags","array-contains",tags[0]).orderBy("date","desc").limit(page.size) )
                // local filter by the selected tags.
                .pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )))  
            : this.fireService.colWithIds$("drops", ref => ref.where("date","<=",page.startAt).orderBy("date","desc").limit(page.size) );
    }));
    this.tags$ = this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc'));
}

  selectTag(tags: string[]) {
    this.selectedTags$.next(tags);
  }

  selectPage(page: any) {
      this.startPage$.next(page);
  }

  tags():Observable<Tag[]> {
    return combineLatest(this.tags$,this.drops$, this.selectedTags$).pipe( map( ([tags,drops, select]) => {
      // filter the tags that are contained in a least one those drops.
      return select.length == 0 ? tags : tags.filter( t => drops.some( d => d.tags.includes(t.name)) );
    }) );
  }

  drops():Observable<Drop[]> {
    return this.drops$.pipe( tap( d => console.log("n drops -> " + d.length)) ); 
  }
}
