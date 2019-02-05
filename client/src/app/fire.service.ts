import { Injectable } from '@angular/core';
import { 
    AngularFirestore, 
    AngularFirestoreCollection, 
    AngularFirestoreDocument,
    DocumentChangeAction,
    Action,
    DocumentSnapshotDoesNotExist,
    DocumentSnapshotExists    
 } from '@angular/fire/firestore';
import { Drop } from './drop';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase/app';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;


@Injectable({
  providedIn: 'root'
})
export class FireService {

    constructor(private firestore: AngularFirestore) { }

    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
        return typeof ref === 'string' ? this.firestore.collection<T>(ref, queryFn) : ref;
    }

    doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
        console.log("fireservice get doc reference...")
        return typeof ref === 'string' ? this.firestore.doc<T>(ref) : ref;
    }

    doc$<T>(ref: DocPredicate<T>): Observable<T> {
        console.log("fireservice get doc observable...")
        return this.doc(ref)
          .snapshotChanges()
          .pipe(
            map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
              return doc.payload.data() as T;
            }),
          );
    }
    docWithId$<T>(ref: DocPredicate<T>): Observable<any> {
        return this.doc(ref)
          .snapshotChanges()
          .pipe(
            map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
                const data: Object = doc.payload.data() as T;
                const id = doc.payload.id;
                return { id, ...data };
            }),
          );
    }
    
    col$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<T[]> {
        console.log("fireservice get col observable...")
        return this.col(ref, queryFn)
          .snapshotChanges()
          .pipe(
            map((docs: DocumentChangeAction<T>[]) => {
              return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
            }),
        );
    }
    
    colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
        return this.col(ref, queryFn)
          .snapshotChanges()
          .pipe(
            map((actions: DocumentChangeAction<T>[]) => {
              return actions.map((a: DocumentChangeAction<T>) => {
                const data: Object = a.payload.doc.data() as T;
                const id = a.payload.doc.id;
                return { id, ...data };
              });
            }),
        );
    }    

    set<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const now = this.timestamp;
        return this.doc(ref).set({
            ...data,
            updatedAt: now,
            createdAt: now,
        });
    }
      
    update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        console.log("fireservice update...")
        const now = this.timestamp;
        return this.doc(ref).update({
            ...data,
            updatedAt: now
        });
    }
      
    delete<T>(ref: DocPredicate<T>): Promise<void> {
        return this.doc(ref).delete();
    }
      
    add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
        const now = this.timestamp;
        return this.col(ref).add({
          ...data,
          updatedAt: now,
          createdAt: now,
        });
    }    

}
