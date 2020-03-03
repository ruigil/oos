import { Component, HostBinding, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject, fromEvent, from, combineLatest, Subscription } from 'rxjs';
import { takeUntil, tap,map,flatMap,pairwise,exhaustMap, filter, take, first, debounceTime, scan, withLatestFrom, distinctUntilChanged, share } from 'rxjs/operators';
import * as moment from 'moment';
import { ScrollDispatcher } from '@angular/cdk/overlay';
import * as firebase from 'firebase/app';
import "firebase/performance";
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
import { DateTimeService } from '../services/date-time.service';
import { trigger, state, style, transition, animate } from '@angular/animations';


interface Page {
    startAt: any;
    size: number;
}

@Component({
    selector: 'oos-home',
    templateUrl: 'home.component.html',
    animations: [
        trigger('openClose', [
            state('fab-buttons-on', style({
                bottom: 90,
                opacity: 1.0,
            })),
            state('fab-buttons-off', style({
                bottom: -300,
                opacity: 0.0
            })),
            transition('fab-buttons-on => fab-buttons-off', [
                animate('0.2s ease-out')
            ]),
            transition('fab-buttons-off => fab-buttons-on', [
                animate('0.3s ease-out')
            ]),
        ]),
    ],
    styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {

  dropsObs: Observable<Drop[]>;
  fabButtons: boolean = false;
  subs: Subscription = new Subscription();
  colors = {};
  perf = firebase.performance();
  drops: Drop[];
  dropsSubs: Subscription;
  stop$: Subject<any> = new Subject();

  page: Page = { startAt: this.dtService.date2ts(moment().endOf('day').toDate()), size: 60 }

  preview: string = "day";
  times: Array<{ name: string, value: string}> = [
      { name: 'Day', value: 'day'},
      { name: 'Week', value: 'week'},
      { name: 'Month', value: 'month'},
      { name: 'Year', value: 'year'}
  ];

  constructor(
      private fireService: FireService,
      private tagFilterService: TagFilterService,
      private router: Router,
      private settings: SettingsService,
      private menu: MenuService,
      private dtService: DateTimeService,
      private scroll: ScrollDispatcher) {


          // this must be refactored to user filtering
      this.subs.add(this.fireService.col$("tags").subscribe( (t:Array<Tag>) => t.map( (t:any) => this.colors[t.name] = t.color ) ));
  }


  ngOnInit(): void {
      this.dropsObs = this.tagFilterService.drops().pipe( tap( _ => console.log("drops in home")) );
      //takeUntil(this.stop$),
      //this.stop$.next();
      //this.stop$.complete();
      //this.tagFilterService.selectTag([]);
        this.subs.add(this.settings.getSettings().subscribe( s => {
            //console.log(s);
            this.preview = s.home.preview;
            this.page.startAt = this.dtService.getTimestamp(s.home.preview);
            this.tagFilterService.selectPage(this.page);
        }));
      //this.dropsSubs = this.tagFilterService.drops().subscribe( d => { console.log("drops in home"); this.drops = d});
      console.log("home init ");
        //this.dropsObs = this.tagFilterService.drops();
        this.subs.add(this.scroll.scrolled(200)
            .pipe(
                map((s:any) => { let p = s.measureScrollOffset("top") / (s.measureScrollOffset("top")+s.measureScrollOffset("bottom")); return p < 0.2 ? -1 : p > 0.8 ? 1 : 0 }),
                distinctUntilChanged(),
                withLatestFrom(this.dropsObs),
                scan( (acc, [dir,drops]) => dir == -1 ? (acc.length != 1 ? acc.slice(0,acc.length-1) : [this.page.startAt] ) : (dir == 1 ? acc.concat([drops[15].date]) : acc) , [this.page.startAt]),
                distinctUntilChanged((prev,curr) => prev.length === curr.length),
            ).subscribe( (acc:any) => { this.tagFilterService.selectPage({startAt: acc[acc.length-1], size: 60}); console.log(acc) })
        );

  }

  menuToggle() {
      this.menu.toggle();
  }

  setStartAt(event) {
      console.log(event);
  }

  textPreview(drop) {
      let lines = drop.text.split("\n");
      return lines[0].length <30 ? lines[0] : lines[0].substring(0,30).concat("...");
  }

  toggleFab() {
      this.fabButtons = !this.fabButtons;
  }
  isType(drop:Drop, type:string) {
      return drop.type === type;
  }

  isRecurrent(drop:Drop) {
      return drop.recurrence !== 'none';
  }

  delete(drop:Drop) {
    console.log("delete drop..."+drop.id);
    let id = drop.id;
    drop.deleted = true;
    if (delete drop.id) {
        this.fireService.update("drops/"+ id, drop ).then(
            (value) => { console.log("success") },
            (error) => { console.log("error") }
        );
    }

  }

  edit(drop:Drop) {
      switch (drop.type) {
          case "NOTE": this.router.navigate(['/note/edit',drop.id]); break;
          case "TRX" : this.router.navigate(['/transaction/edit',drop.id]); break;
          case "TASK": this.router.navigate(['/task/edit',drop.id]); break;
          case "GOAL": this.router.navigate(['/goal/edit',drop.id]); break;
          case "RATE": this.router.navigate(['/rate/edit',drop.id]); break;
          default: console.log("Unknow type");
      }
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

  dropIdentity( index, drop) {
      return drop.id;
  }

  complete(drop:Drop) {
        drop.task.completed = !drop.task.completed;
        let id = drop.id;
        drop.task.date = this.dtService.date2ts(new Date());
        if (delete drop.id) {
            this.fireService.update("drops/"+ id, drop ).then(
                (value) => { console.log("success") },
                (error) => { console.log("error") }
            );
        }
  }

  rate(drop,value) {
        drop.rate.value = value;
        let id = drop.id;
        if (delete drop.id) {
            this.fireService.update("drops/"+ id, drop ).then(
                (value) => { console.log("success") },
                (error) => { console.log("error") }
            );
        }
  }

  futurePreview(event) {
      //console.log(event);
      //console.log(this.preview);
    this.page.startAt =  this.dtService.getTimestamp(this.preview);
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
  }

  ngOnDestroy() {
      console.log("home destroy ");
      this.stop$.next();
      this.stop$.complete();
      //this.dropsSubs.unsubscribe();
      //this.dropsObs.
    this.subs.unsubscribe();
  }

}
