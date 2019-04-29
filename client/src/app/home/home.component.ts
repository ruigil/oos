import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, fromEvent, from, combineLatest } from 'rxjs';
import { tap,map,flatMap,pairwise,exhaustMap, filter, take, first, debounceTime, scan, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { isToday, isFuture, addWeeks, addMonths, endOfToday, addYears, format } from 'date-fns';

import { TagFilterService } from '../services/tag-filter.service';
import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { IonContent } from '@ionic/angular';


import { Drop } from '../model/drop';

import { 
    AngularFirestore, 
    AngularFirestoreCollection, 
    AngularFirestoreDocument,
    DocumentChangeAction,
    Action,
    DocumentSnapshotDoesNotExist,
    DocumentSnapshotExists    
 } from '@angular/fire/firestore';


interface Position {
  top: number;
  cH: number;
  sH: number;
};

interface Page {
    startAt: any;
    size: number;
}

@Component({
  selector: 'oos-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  @ViewChild("content") content: IonContent;
  dropsObs: Observable<Drop[]>;
  scrollEvents$ : Observable<any>;

  finished: boolean = true;

  page: Page = { startAt: this.fireService.date2ts(endOfToday()), size: 60 }
  startAt = format(endOfToday(),"YYYY-MM-DDTHH:mm:ss");

  scrollPercent: number = 80;

  constructor(
      private fireService: FireService, 
      private tagFilterService: TagFilterService, 
      private router: Router, 
      private settings: SettingsService) {

      settings.getSettings().subscribe( s => {
          console.log(s);
          this.page.startAt = this.getTimestamp(s.home.preview);
          this.tagFilterService.selectPage(this.page);
      });

  }

  getTimestamp(time: string): any {
      return time == "week" ? this.fireService.date2ts(addWeeks(endOfToday(),1)) :
        time == "month" ? this.fireService.date2ts(addMonths(endOfToday(),1)) :
        time == "year" ? this.fireService.date2ts(addYears(endOfToday(),1)) : /* today */this.fireService.date2ts(endOfToday());
  }

  ngOnInit(): void {
        this.dropsObs = this.tagFilterService.drops();
        
        // implements a infinite scrolling page sliding window
        // take the client 
        // calculate the size of the page, and the number of elements visible
        // multiply by 4 to get the page size
        // when scrolltop + clientHeight /2 > 75%
        // startat new drop to put the scroll at 50%
        from( this.content.getScrollElement() )
        .pipe( flatMap( element => fromEvent(element,'scroll')) )
        .pipe( 
            map((e: any): Position => ({ 
                top: e.target.scrollTop, 
                cH: e.target.clientHeight,
                sH: e.target.scrollHeight
            })),
            pairwise(),
            map( (p:any) => ({ up: p[0].top > p[1].top, percent: p[0].top > p[1].top ? p[1].top / p[1].sH : (p[1].top + p[1].cH)/p[1].sH }) ),
            filter(p => ( !p.up && p.percent > (this.scrollPercent / 100)) || (p.up && p.percent < ((100-this.scrollPercent) / 100))),
            debounceTime(500),
            tap( p => console.log(p)),
            withLatestFrom(this.dropsObs),
            scan( (acc,[s,d]) => s.up ? (acc.length != 1 ? acc.slice(0,acc.length-1) : acc) : (d[10].date ? acc.concat( [d[10].date] ) : acc) , [this.page.startAt] ),
            distinctUntilChanged((prev, curr) => prev.length == curr.length),
        ).subscribe( acc => {console.log(acc);this.tagFilterService.selectPage({startAt: acc[acc.length-1], size: 60} ) } );

  }

  isNote(drop:Drop) {
      return drop.type === "NOTE";
  }

  isTransaction(drop:Drop) {
      return drop.type === "TRX";
  }
  
  isTask(drop:Drop) {
      return drop.type === "TASK";
  }

  isSystem(drop:Drop) {
      return drop.type === "SYS";
  }

  isRecurrent(drop:Drop) {
      return drop.recurrence !== 'none';
  }

  getRouterLink(drop:Drop) {
      return this.isNote(drop) ? ['/note',drop.id] : this.isTransaction(drop) ? ['/transaction',drop.id] : ['/task',drop.id];
  }

  delete(slidingItem,drop:Drop) {
        slidingItem.close(); // important 
        let id = drop.id;
        this.fireService.delete("drops/"+drop.id).then(
            (value) => { console.log(" deleted item") },
            (error) => { console.log("error") }
        );
  }

  edit(slidingItem, drop:Drop) {
      slidingItem.close(); // important 
      return this.isNote(drop) ? this.router.navigate(['/note/edit',drop.id]) : this.isTransaction(drop) ? this.router.navigate(['/transaction/edit',drop.id]) : this.router.navigate(['/task/edit',drop.id]);
  }

  isToday(drop:Drop) {
      return isToday(drop.date.toDate());
  }
  
  isFuture(drop:Drop):boolean {
      return isFuture(drop.date.toDate());
  }

  dropIdentity( index, drop) {
      return drop.id;
  }

  complete(drop:Drop) {
        drop.task.completed = !drop.task.completed;
        let id = drop.id;
        drop.task.date = this.fireService.date2ts(new Date());
        if (delete drop.id)
            this.fireService.update("drops/"+ id, drop ).then( 
                (value) => { console.log("success") },
                (error) => { console.log("error") }
            );
  }

  futurePreview(event) {
      this.tagFilterService.selectPage({ startAt: this.getTimestamp(event.detail.value), size: 60 } );
  }


}
