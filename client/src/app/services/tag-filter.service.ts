import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, flatMap, filter } from 'rxjs/operators';
import { addDays, addWeeks, addMonths, addYears, endOfToday } from 'date-fns';

import { FireService } from '../services/fire.service';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  drops$: Observable<Drop[]>;
  tags$: Observable<Tag[]>;
  selectedTags$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  timeFrame$: BehaviorSubject<any> = new BehaviorSubject(this.fireService.date2ts(endOfToday()));

  constructor(private fireService: FireService) {
    this.drops$ = combineLatest(this.selectedTags$,this.timeFrame$).pipe( flatMap( ([tags,ts]) => {
        const dropsObs = tags.length > 0 ? 
            this.fireService.colWithIds$("drops", ref => ref.where("date","<=",ts).where("tags","array-contains",tags[0]).orderBy("date","desc")) :
            this.fireService.colWithIds$("drops", ref => ref.where("date","<=",ts).orderBy("date","desc"));
        // local filter by the selected tags.
        return dropsObs.pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )));
    }));

    this.tags$ = this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc'));
}

  selectTag(tags: string[]) {
    this.selectedTags$.next(tags);
  }

  selectTimeFrame( value: string) {
    const ts =  value == "week" ? this.fireService.date2ts(addWeeks(endOfToday(),1)) :
                value == "month" ? this.fireService.date2ts(addMonths(endOfToday(),1)) :
                value == "year" ? this.fireService.date2ts(addYears(endOfToday(),1)) : /* today */this.fireService.date2ts(endOfToday());
    this.timeFrame$.next(ts);
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
