import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { TagFilterService } from '../tag-filter.service';
import { Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';
import { Router } from '@angular/router';

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

  constructor(private dropsService: FireService, private tagFilterService: TagFilterService, private router: Router) {
  }

  ngOnInit(): void {
      this.dropsObs = this.tagFilterService.drops();
  }

  isNote(drop:Drop) {
      return drop.tags.includes('Note') || drop.type === "NOTE";
  }

  isTransaction(drop:Drop) {
      return drop.tags.includes('Transaction') || drop.type === "TRX";
  }
  
  isTask(drop:Drop) {
      return drop.tags.includes('Task') || drop.type === "TASK"
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

  complete(drop:Drop) {
      drop.completed = !drop.completed;
      console.log("complete");
  }

}
