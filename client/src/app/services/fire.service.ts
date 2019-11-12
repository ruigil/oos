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

import * as firebase from 'firebase/app';

import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FireService {

    uid: string;

    constructor(private firestore: AngularFirestore, private authService: AuthService) { 
        this.authService.user().subscribe( u => {
            console.log("new User Logged in in fireservice");
            console.log("new user uid " + u.uid ? u.uid : "NULL");
            this.uid = u.uid ? u.uid : "NULL";
        });
    }

    get timestamp() {
        return firebase.firestore.Timestamp.fromDate(new Date());
    }

    col<T>(ref: CollectionPredicate<T>, queryFn?): AngularFirestoreCollection<T> {
        return typeof ref === 'string' ? this.firestore.collection<T>(ref, queryFn) : ref;
    }

    doc<T>(ref: DocPredicate<T>): AngularFirestoreDocument<T> {
        return typeof ref === 'string' ? this.firestore.doc<T>(ref) : ref;
    }

    doc$<T>(ref: DocPredicate<T>): Observable<T> {
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
            uid: this.uid,
            updatedAt: now,
            createdAt: now,
        });
    }
      
    update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const now = this.timestamp;
        return this.doc(ref).update({
            ...data,
            uid: this.uid,
            updatedAt: now
        });
    }
      
    delete<T>(ref: DocPredicate<T>): Promise<void> {
        console.log("obtain ref");
        let d  = this.doc(ref);
        console.log("delete");
        return d.delete();
    }
      
    add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
      const now = this.timestamp;
        return this.col(ref).add({
          ...data,
          uid: this.uid,
          deleted: false,
          updatedAt: now,
          createdAt: now,
        });
    }

}
