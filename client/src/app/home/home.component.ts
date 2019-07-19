import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, fromEvent, from, combineLatest } from 'rxjs';
import { tap,map,flatMap,pairwise,exhaustMap, filter, take, first, debounceTime, scan, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { isToday, isBefore, isFuture, isPast, addWeeks, addMonths, endOfToday, addYears, format, isThisWeek, isThisMonth } from 'date-fns';
import { ScrollDispatcher } from '@angular/cdk/overlay';

import { TagFilterService } from '../services/tag-filter.service';
import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { MenuService } from '../services/menu.service';

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
//  @ViewChild("content") content: IonContent;
  dropsObs: Observable<Drop[]>; 
  //dropsObs: Drop[];
  scrollEvents$ : Observable<any>;
  fabButtons: boolean = false;

  page: Page = { startAt: this.fireService.date2ts(endOfToday()), size: 60 }
  startAt = format(endOfToday(),"YYYY-MM-DDTHH:mm:ss");
  finished:boolean = false;
  preview: string = "day";
  times: Array<{ name: string, value: string}> = [ 
      { name: 'Day', value: 'day'},
      { name: 'Week', value: 'week'},
      { name: 'Month', value: 'month'},
      { name: 'Year', value: 'year'}
  ];

   dropsA: Drop[];

  constructor(
      private fireService: FireService, 
      private tagFilterService: TagFilterService, 
      private router: Router, 
      private settings: SettingsService,
      private menu: MenuService,
      private scroll: ScrollDispatcher) {

      settings.getSettings().subscribe( s => {
          this.preview = s.home.preview; 
          this.page.startAt = this.getTimestamp(s.home.preview);
          this.tagFilterService.selectPage(this.page);
          this.startAt = format(this.page.startAt.toDate(),"YYYY-MM-DDTHH:mm:ss");
      });

  }

  menuToggle() {
      this.menu.toggle();
  }

  getTimestamp(time: string): any {
      return time == "week" ? this.fireService.date2ts(addWeeks(endOfToday(),1)) :
        time == "month" ? this.fireService.date2ts(addMonths(endOfToday(),1)) :
        time == "year" ? this.fireService.date2ts(addYears(endOfToday(),1)) : /* today */this.fireService.date2ts(endOfToday());
  }

  ngOnInit(): void {
        this.dropsObs = this.tagFilterService.drops();
        this.scroll.scrolled(200)
            .pipe( 
                map((s:any) => { let p = s.measureScrollOffset("top") / (s.measureScrollOffset("top")+s.measureScrollOffset("bottom")); return p < 0.33 ? -1 : p > 0.66 ? 1 : 0 }),
                distinctUntilChanged(),   
                withLatestFrom(this.dropsObs), 
                scan( (acc, [dir,drops]) => dir == -1 ? (acc.length != 1 ? acc.slice(0,acc.length-1) : [this.page.startAt] ) : (dir == 1 ? acc.concat([drops[15].date]) : acc) , [this.page.startAt]),
                distinctUntilChanged((prev,curr) => prev.length === curr.length),    
            ).subscribe( (acc:any) => {this.tagFilterService.selectPage({startAt: acc[acc.length-1], size: 60}); console.log(acc) });
  }

  toggleFab() {
      this.fabButtons = !this.fabButtons;
  }

  changeStartAt(event) {
      console.log(event);
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

  delete(drop:Drop) {
        let id = drop.id;
        this.fireService.delete("drops/"+drop.id).then(
            (value) => { console.log(" deleted item") },
            (error) => { console.log("error") }
        );
  }

  edit(drop:Drop) {
      return this.isNote(drop) ? this.router.navigate(['/note/edit',drop.id]) : this.isTransaction(drop) ? this.router.navigate(['/transaction/edit',drop.id]) : this.router.navigate(['/task/edit',drop.id]);
  }

  isToday(drop) {
      return isToday(drop.date.toDate());
  }
  
  isWeek(drop) {
      return isBefore(drop.date.toDate(),addWeeks(endOfToday(),1)) && !isToday(drop.date.toDate());
  }
  
  isMonth(drop) {
      return isBefore(drop.date.toDate(),addMonths(endOfToday(),1)) && !this.isWeek(drop) && !isToday(drop.date.toDate()); 
  }

  isPast(drop) {
      return isPast(drop.date.toDate()) && !isToday(drop.date.toDate()); 
  }

  dropTimeColor(drop): string {
      let d = drop.date.toDate();
      return isToday(d) ? 'medium' : isFuture(d) ? (isThisWeek(d) ? 'warning' : isThisMonth(d) ? 'primary' : 'dark') : 'light';
  }

  dropIdentity( index, drop) {
      return drop.id;
  }

  complete(drop:Drop) {
        console.log("complete:");
        drop.task.completed = !drop.task.completed;
        console.log(drop.task.completed);
        let id = drop.id;
        drop.task.date = this.fireService.date2ts(new Date());
        if (delete drop.id)
            this.fireService.update("drops/"+ id, drop ).then( 
                (value) => { console.log("success") },
                (error) => { console.log("error") }
            );
  }

  event(evt) {
      console.log(evt);
  }

  futurePreview(event) {
      //console.log(event);
      //console.log(this.preview);
      this.page.startAt = this.getTimestamp(this.preview);
      this.startAt = format(this.page.startAt.toDate(),"YYYY-MM-DDTHH:mm:ss");
      this.tagFilterService.selectPage(this.page);
  }


}
