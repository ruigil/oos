import { Injectable } from '@angular/core';
import { ReplaySubject, Subject, Observable, BehaviorSubject, combineLatest, of, from } from 'rxjs';
import { map, flatMap, switchMap, filter, tap, withLatestFrom, distinctUntilChanged, shareReplay, share } from 'rxjs/operators';  

import { FireService } from '../services/fire.service';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";
import * as moment from 'moment';
import { AuthService } from './auth.service';
import { DateTimeService } from '../services/date-time.service';
import { SettingsService } from '../services/settings.service';

interface Page {
    startAt: any;
    size: number;
}

@Injectable({
  providedIn: 'root'
})
export class TagFilterService {

  page: Page = { startAt: this.dtService.date2ts(moment().endOf('day').toDate()), size: 30 }
  //drops$: Observable<Drop[]>;
  //tags$: Observable<any[]>;
  drops$: ReplaySubject<Drop[]> = new ReplaySubject<Drop[]>(1); 
  tags$: Subject<Tag[]> = new Subject<Tag[]>();
  selectedTags$: BehaviorSubject<string[]> = new BehaviorSubject([]); 
  //startPage$: BehaviorSubject<Page> = new BehaviorSubject(this.page);
  startPage$: Subject<Page> = new Subject();

  constructor(private settings: SettingsService, private dtService: DateTimeService, private fireService: FireService, private authService: AuthService) {
 
     combineLatest(this.authService.user(),this.startPage$, this.selectedTags$).pipe( 
         tap( ([u,page,tags]) => console.log("user is ", u)),
         filter( ([u,page,tags]) => !!u.uid), 
         tap( _ => console.log("remote drops...")), 
         switchMap( ([u,page,tags]) => 
            tags.length > 0 ? this.fireService.colWithIds$("drops", ref => ref.where("uid","==",u.uid).where("tags","array-contains",tags[0]).orderBy("date","desc").startAt(page.startAt).limit(page.size) )
                // local filter by the selected tags.
                .pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )))           
            : this.fireService.colWithIds$("drops", ref => ref.where("uid","==",u.uid).orderBy("date","desc").startAt(page.startAt).limit(page.size))), 
         map( (ds:Drop[]) => ds.filter( d => !d.deleted ) ),
         //shareReplay(),
         tap( d => console.log("local drops...", d.length)) )
    .subscribe( (drops:Drop[]) => this.drops$.next(drops) );
      
      
      //this.drops$ = this.fireService.colWithIds$("drops", ref => ref.orderBy("date","desc").limit(30)).pipe(tap( _ => console.log("drops in drops")),shareReplay()); 
      /*
    this.drops$ = combineLatest(this.selectedTags$,this.startPage$, this.authService.user()).pipe( filter(([tags,page,user]) => !!user.uid), switchMap( ([tags,page,user]) => {  
        //console.log("tags"); 
        //console.log(tags);
        //console.log("page");
        //console.log(page);
        console.log("get drops...");
        //console.log(user);
        return tags.length > 0 ?
            this.fireService.colWithIds$("drops", ref => ref.where("uid","==",user.uid).where("tags","array-contains",tags[0]).orderBy("date","desc").startAt(page.startAt).limit(page.size) )
                // local filter by the selected tags.
                .pipe ( map( drops => drops.filter( d => tags.every(t => d.tags.includes(t),this) )))  
            : this.fireService.colWithIds$("drops", ref => ref.where("uid","==",user.uid).orderBy("date","desc").startAt(page.startAt).limit(page.size) );
    }), map( (ds:Drop[]) => ds.filter( d => !d.deleted ) ), shareReplay(), tap( d => console.log("n drops -> " + d.length)) );
*/
/*
    this.tags$ = combineLatest(this.authService.user(), this.drops$, this.selectedTags$)
      .pipe( 
          tap(([user,drops, stags]) => { console.log(" new user in tags" )  } ),
          filter( ([user,drops, stags]) => !!user.uid),
          tap(([user,drops, stags]) => { console.log(" user is " ); console.log(user) } ),
          flatMap( ([user,drops, stags]) => 
            this.fireService.colWithIds$("tags", ref => ref.where("uid","==",user.uid).orderBy('updatedAt','desc'))
            .pipe( map( (tags:Array<Tag>) => tags.filter( t => drops.some( d => d.tags.includes(t.name)) )), tap( t => console.log(" get tags in observer")) ) 
          ) 
      )
*/

    //this.tags$ = this.authService.user().pipe( withLatestFrom(this.drops$), map(([u,d]) => {console.log("user in tags"); return []} ) ); 
    
    //this.tags$ = this.authService.user().pipe( filter( u => !!u.uid), withLatestFrom(this.drops$), map( ([u,d]) => {console.log("user in tags"); return []} ) );   
    //this.tags$ = this.authService.user().pipe( filter( u => !!u.uid), map( (u) => {console.log("user in tags"); return []} ) );   

    combineLatest(this.authService.user(),this.drops$).pipe( 
          tap( _ => { console.log("drops in tags")}),
          filter( ([u,d]) => !!u.uid ),
          tap( _ => { console.log("user in tags ") }),
          switchMap( ([u,drops]) => 
            this.fireService.colWithIds$("tags", ref => ref.where("uid","==",u.uid).orderBy('updatedAt','desc'))
            .pipe( map( t => t.filter( t => drops.some( d => d.tags.includes(t.name))))) 
        ))
    .subscribe( (tags:Tag[]) => this.tags$.next(tags) );
   }

  selectTag(tags: string[]) {
      console.log("select tags", tags);
    this.selectedTags$.next(tags);
  }

  selectPage(page: Page) {
      console.log("setting page ", page);
      this.startPage$.next(page);
  }

  tags():Observable<Tag[]> { 
      return this.tags$;
      /*
    return this.authService.user().pipe (
        filter( u => u != null),
        tap( u => console.log("getting tags")),
        tap( u => console.log(u)),
        flatMap( u => combineLatest(this.fireService.colWithIds$("tags", ref => ref.where("uid","==",u.uid).orderBy('updatedAt','desc')),this.drops$)
                .pipe( map( ([tags,drops]) => {
                // filter the tags that are contained in a least one those drops.
                return tags.filter( t => drops.some( d => d.tags.includes(t.name)) );
    }))));*/
  }

  drops():Observable<Drop[]> {
    return this.drops$;
  }
}
 