import { Injectable } from '@angular/core';
import { Subject, Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { map, flatMap, filter, tap, withLatestFrom, distinctUntilChanged, shareReplay, share } from 'rxjs/operators';

import { FireService } from '../services/fire.service';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";
import * as moment from 'moment';
import { AuthService } from './auth.service';
 
interface Page {
    startAt: any;
    size: number;
}

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  drops$: Observable<Drop[]>;
  selectedTags$: BehaviorSubject<string[]> = new BehaviorSubject([]);
  startPage$: Subject<Page> = new Subject();  

  constructor(private fireService: FireService, private authService: AuthService) {

      
    this.drops$ = combineLatest(this.selectedTags$,this.startPage$, this.authService.user()).pipe( flatMap( ([tags,page,user]) => {  
        //console.log("tags");
        //console.log(tags);
        //console.log("page");
        //console.log(page);  
        return tags.length > 0 ? 
            this.fireService.colWithIds$("drops", ref => ref.where("uid","==",user.uid).where("deleted","==",false).where("tags","array-contains",tags[0]).orderBy("date","desc").startAt(page.startAt).limit(page.size) )
                // local filter by the selected tags.
                .pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )))  
            : this.fireService.colWithIds$("drops", ref => ref.where("uid","==",user.uid).where("deleted","==",false).orderBy("date","desc").startAt(page.startAt).limit(page.size) );
    }), share(), tap( d => console.log("n drops -> " + d.length))  );  
}

  selectTag(tags: string[]) {
    this.selectedTags$.next(tags);
  }

  selectPage(page: Page) {
      this.startPage$.next(page);
  }

  tags():Observable<Tag[]> {
    return combineLatest(this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc')),this.drops$)
    .pipe( map( ([tags,drops]) => {
      // filter the tags that are contained in a least one those drops.
      return tags.filter( t => drops.some( d => d.tags.includes(t.name)) ); 
    }));
  }

  drops():Observable<Drop[]> {
    return this.drops$; 
  }
}
