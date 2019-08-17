import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, fromEvent, from, combineLatest } from 'rxjs';
import { tap,map,flatMap,pairwise,exhaustMap, filter, take, first, debounceTime, scan, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { ScrollDispatcher } from '@angular/cdk/overlay';

import { TagFilterService } from '../services/tag-filter.service';
import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { MenuService } from '../services/menu.service';

import { Drop } from '../model/drop';
import { Tag } from '../model/tag';

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
  dropsObs: Observable<Drop[]>; 
  fabButtons: boolean = false;
  colors = {};

  alltags: Array<Tag> = [];

  
  page: Page = { startAt: this.fireService.date2ts(moment().endOf('day').toDate()), size: 60 }
  //startAt = format(endOfToday(),"YYYY-MM-DDTHH:mm:ss");
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
          this.fireService.col$("tags").subscribe( (t:Array<Tag>) => t.map( (t:any) => this.colors[t.name] = t.color ) ); 
      });

  }

  menuToggle() {
      this.menu.toggle();
  }

  getTimestamp(time: string): any {
      let m = moment().endOf('day');
      return time == "week" ? this.fireService.date2ts(moment(m).add(1,"weeks").toDate()) :
        time == "month" ? this.fireService.date2ts(moment(m).add(1,"months").toDate()) :
        time == "year" ? this.fireService.date2ts(moment(m).add(1,"years").toDate()) : /* today */this.fireService.date2ts(m.toDate());
  }

  ngOnInit(): void {
        this.dropsObs = this.tagFilterService.drops().pipe( tap( d => console.log( "drops "+ d.length ) ) );
        this.scroll.scrolled(200)
            .pipe( 
                map((s:any) => { let p = s.measureScrollOffset("top") / (s.measureScrollOffset("top")+s.measureScrollOffset("bottom")); return p < 0.33 ? -1 : p > 0.66 ? 1 : 0 }),
                distinctUntilChanged(),   
                withLatestFrom(this.dropsObs), 
                scan( (acc, [dir,drops]) => dir == -1 ? (acc.length != 1 ? acc.slice(0,acc.length-1) : [this.page.startAt] ) : (dir == 1 ? acc.concat([drops[15].date]) : acc) , [this.page.startAt]),
                distinctUntilChanged((prev,curr) => prev.length === curr.length),    
            ).subscribe( (acc:any) => {this.tagFilterService.selectPage({startAt: acc[acc.length-1], size: 60}); console.log(acc) });
  }

  setStartAt(event) {
      console.log(event);
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

  isAnalytics(drop:Drop) {
      return drop.type === "ANLY";
  }

  isSystem(drop:Drop) {
      return drop.type === "SYS";
  }
  isRate(drop:Drop) {
      return drop.type === "RATE";
  }
  isGoal(drop:Drop) {
      return drop.type === "GOAL";
  }

  isRecurrent(drop:Drop) {
      return drop.recurrence !== 'none';
  }

  getRouterLink(drop:Drop) {
      return this.isNote(drop) ? ['/note',drop.id] : this.isTransaction(drop) ? ['/transaction',drop.id] : this.isTask(drop) ? ['/task',drop.id] : ['/rate',drop.id];
  }

  delete(drop:Drop) {
      console.log("delete drop...");
        let id = drop.id;
        this.fireService.delete("drops/"+drop.id).then(
            (value) => { console.log(" deleted item") },
            (error) => { console.log("error") }
        );
  }

  edit(drop:Drop) {
      return this.isNote(drop) ? this.router.navigate(['/note/edit',drop.id]) : this.isTransaction(drop) ? this.router.navigate(['/transaction/edit',drop.id]) : this.isTask(drop) ? this.router.navigate(['/task/edit',drop.id]) : this.router.navigate(['/rate/edit',drop.id]);
  }

  isToday(drop) {
      return moment().isSame(drop.date.toDate(),"day");
  }
  
  isWeek(drop) {
      return moment(drop.date.toDate()).isBefore(moment().endOf("day").add(1,"weeks")) && !this.isToday(drop);
  }
  
  isMonth(drop) {
      return moment(drop.date.toDate()).isBefore(moment().endOf("day").add(1,"months")) && !this.isWeek(drop) && !this.isToday(drop);
  }

  isPast(drop) {
      return moment(drop.date.toDate()).isBefore(moment().startOf("day")); 
  }

  /*
  dropTimeColor(drop): string {
      let d = drop.date.toDate();
      return isToday(d) ? 'medium' : isFuture(d) ? (isThisWeek(d) ? 'warning' : isThisMonth(d) ? 'primary' : 'dark') : 'light';
  }
  */

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

  rate(drop,value) {
        console.log("rate:"+value);
        drop.rate.value = value;
        let id = drop.id;
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
      //this.startAt = format(this.page.startAt.toDate(),"YYYY-MM-DDTHH:mm:ss");
      this.tagFilterService.selectPage(this.page);
  }

  dropTags(tags) {
      return Object.keys(tags);
  }
  
  aTag(tags,tag,type) {
      return tags[tag][type];
  }

  tagColor(tag) {
        return this.colors[tag]; 
        /*
    if (this.alltags.length !== 0) {
    } else {
        return tags.map( t => ({ name: t, color: 'dark'}) );
    }
    */
  }

}
