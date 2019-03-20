import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { TagFilterService } from '../tag-filter.service';
import { Observable } from 'rxjs';
import { tap,map } from 'rxjs/operators';
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
  private selectedItem: any;
  private icons = [
    'flask',
    'wifi',
    'beer',
    'football',
    'basketball',
    'paper-plane',
    'american-football',
    'boat',
    'bluetooth',
    'build'
  ];
  public items: Array<{ id: string, date: string, note: string; icon: string }> = [];
  dropsObs: Observable<Drop[]>;

  constructor(private dropsService: FireService, private tagFilterService: TagFilterService) {
  }

  ngOnInit(): void {
      this.dropsObs = this.tagFilterService.drops();
  }

  isNote(drop:Drop) {
      return drop.tags.includes('Note');
  }

  isTransaction(drop:Drop) {
      return drop.tags.includes('Transaction');
  }
  
  isTask(drop:Drop) {
      return drop.tags.includes('Task');
  }

  isRecurrent(drop:Drop) {
      return (this.isTransaction(drop) && drop.transaction.recurrence !== 'none') || 
            (this.isTask(drop) && drop.task.recurrence !== 'none')
  }

  getRouterLink(drop:Drop) {
      return this.isNote(drop) ? ['/note',drop.id] : this.isTransaction(drop) ? ['/transaction',drop.id] : ['/task',drop.id];
  }

  deleteDrop(id,event) {
    console.log("delete "+id);
    this.dropsService.delete("drops/"+id).then( 
        (value) => { console.log("deletes") },
        (error) => { console.log("error") }
    );
  }

}
