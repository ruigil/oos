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

import { Observable, of, from } from 'rxjs';
import { map, take, withLatestFrom, combineLatest, flatMap, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

type CollectionPredicate<T> = string | AngularFirestoreCollection<T>;
type DocPredicate<T> = string | AngularFirestoreDocument<T>;

@Injectable({
  providedIn: 'root'
})
export class FireService {

    uid: string;
    loggedIn: boolean = false;

    constructor(private firestore: AngularFirestore, private authService: AuthService) {
        /*
        this.authService.user().subscribe( u => {
            console.log("new User Logged in in fireservice");
            console.log(u);
            //console.log("new user uid " + !!u ? u.uid : "NULL");
            this.loggedIn = u != null;
            if (this.loggedIn) this.uid = u.uid;
        });
        */
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
              withLatestFrom(this.authService.user()),
            //map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
              map(([doc,user]) => {
              return doc.payload.data() as T;
            }),
          );
    }
    docWithId$<T>(ref: DocPredicate<T>): Observable<any> {
        return this.doc(ref)
          .snapshotChanges()
          .pipe(
              withLatestFrom(this.authService.user()),
            //map((doc: Action<DocumentSnapshotDoesNotExist | DocumentSnapshotExists<T>>) => {
              map(([doc,user]) => {
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
              withLatestFrom(this.authService.user()),
            //map((docs: DocumentChangeAction<T>[]) => {
              map(([docs,user]) => {
              return docs.map((a: DocumentChangeAction<T>) => a.payload.doc.data()) as T[];
            }),
        );
    }
    
    colWithIds$<T>(ref: CollectionPredicate<T>, queryFn?): Observable<any[]> {
        //if (!this.loggedIn) return of([])
        //else 
        return this.col(ref, queryFn)
          .snapshotChanges()
          .pipe(
              withLatestFrom(this.authService.user()),
            //map((actions: DocumentChangeAction<T>[]) => {
              map(([actions,user]) => {
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
        return from([this.doc(ref)])
                .pipe( 
                    withLatestFrom(this.authService.user()),
                    switchMap( ([doc,user]) => from(doc.set({...data, uid: user.uid, createdAt: now, updatedAt: now }) )),
                    tap( (_) => console.log("doc set") )
                ).toPromise();
    }
      
    update<T>(ref: DocPredicate<T>, data: any): Promise<void> {
        const now = this.timestamp;
        console.log("update in fireservice...");
        return from([this.doc(ref)])
                .pipe( 
                    withLatestFrom(this.authService.user()),
                    switchMap( ([doc,user]) => from(doc.update({...data, uid: user.uid, updatedAt: now }) )),
                    tap( (_) => console.log("doc updated") )
                ).toPromise();
    }
      
    delete<T>(ref: DocPredicate<T>): Promise<void> {
        //console.log("obtain ref");
        //let d  = this.doc(ref);
        //console.log("delete");
        //return d.delete();
        // cannot delete a drop without index rebuilt, and that takes a loooot of time!
        return null;
    }
      
    add<T>(ref: CollectionPredicate<T>, data): Promise<firebase.firestore.DocumentReference> {
        const now = this.timestamp;
        console.log("entering add...");
        console.log(this.col(ref)); 
        return from([this.col(ref)])
                .pipe( 
                    tap( (d) => { console.log("doc is: "); console.log(d) }), 
                    withLatestFrom(this.authService.user()),
                    flatMap( ([col,user]) => { console.log("flatmap"); console.log(col); console.log(user); return from(col.add({...data, uid: user.uid, deleted: false, createdAt: now, updatedAt: now })) }), 
                    tap( (_) => console.log("doc added") )
                ).toPromise();
    }

}
