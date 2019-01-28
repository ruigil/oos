import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Drop } from './drop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DropsService {

   constructor(private firestore: AngularFirestore) { }

    getDrops() {
        return this.firestore.collection<Drop>('drops').snapshotChanges().pipe( 
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data() as Drop;
                    const id = a.payload.doc.id;
                    return { id, ...data };
                })));
    }
    
    createDrop(drop: Drop) {
        return this.firestore.collection<Drop>('drops').add(drop);
    }

    updateDrop(drop: Drop) {
        return this.firestore.doc('drops/'+drop.id).update(drop);
    }

    deleteDrop(drop: Drop) {
        return this.firestore.doc('drops/'+drop.id).delete();
    }

}
