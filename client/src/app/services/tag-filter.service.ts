import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, flatMap, filter, tap } from 'rxjs/operators';
import { addDays, addWeeks, addMonths, addYears, endOfToday } from 'date-fns';

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
  startAt$: Subject<any> = new Subject();

  constructor(private fireService: FireService) {
    this.drops$ = combineLatest(this.selectedTags$,this.startAt$).pipe( flatMap( ([tags,sa]) => {
            ////console.log(tags);
            //console.log(ts);
            //console.log(sa);
        return tags.length > 0 ? 
            this.fireService.colWithIds$("drops", ref => ref.where("date","<=",sa).where("tags","array-contains",tags[0]).orderBy("date","desc").limit(20) )
                // local filter by the selected tags.
                .pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )))  
            : this.fireService.colWithIds$("drops", ref => ref.where("date","<=",sa).orderBy("date","desc").limit(20) );
    }));
    this.tags$ = this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc'));
}

  selectTag(tags: string[]) {
      console.log("select tag")
    //this.selectedTags$.next(tags);
  }

  selectStartAt(start: any) {
      console.log("start at");
      console.log(start);
      this.startAt$.next(start);
  }

  selectTimeFrame( value: string) {
      console.log("select timeframe");
    const ts =  value == "week" ? this.fireService.date2ts(addWeeks(endOfToday(),1)) :
                value == "month" ? this.fireService.date2ts(addMonths(endOfToday(),1)) :
                value == "year" ? this.fireService.date2ts(addYears(endOfToday(),1)) : /* today */this.fireService.date2ts(endOfToday());
    //this.timeFrame$.next(ts);
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
