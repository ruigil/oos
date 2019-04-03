import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { TagFilterService } from '../tag-filter.service';
import { Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isSameDay, isFuture } from 'date-fns';

import { 
    AngularFirestore, 
    AngularFirestoreCollection, 
    AngularFirestoreDocument,
    DocumentChangeAction,
    Action,
    DocumentSnapshotDoesNotExist,
    DocumentSnapshotExists    
 } from '@angular/fire/firestore';

@Component({
  selector: 'home-page',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  dropsObs: Observable<Drop[]>;
  date: any;

  constructor(private dropsService: FireService, private tagFilterService: TagFilterService, private router: Router) {
      this.date = new Date();
  }

  ngOnInit(): void {
      this.dropsObs = this.tagFilterService.drops();
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
        this.dropsService.delete("drops/"+drop.id).then(
            (value) => { console.log(" deleted item") },
            (error) => { console.log("error") }
        );
  }

  edit(slidingItem, drop:Drop) {
      slidingItem.close(); // important 
      return this.isNote(drop) ? this.router.navigate(['/note/edit',drop.id]) : this.isTransaction(drop) ? this.router.navigate(['/transaction/edit',drop.id]) : this.router.navigate(['/task/edit',drop.id]);
  }

  isToday(drop:Drop) {
      return isSameDay(drop.date.toDate(),this.date);
  }
  
  isFuture(drop:Drop):boolean {
      return isFuture(drop.date.toDate());
  }

  timeFrame(event) {
      this.tagFilterService.selectTimeFrame(event.detail.value);
  }

  complete(drop:Drop) {
        drop.task.completed = !drop.task.completed;
        let id = drop.id;
        drop.task.date = this.dropsService.date2ts(new Date());
        if (delete drop.id)
            this.dropsService.update("drops/"+ id, drop ).then( 
                (value) => { console.log("success") },
                (error) => { console.log("error") }
            );
    console.log("complete");
  }

}
