import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../model/user';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ : Observable<User>;

  constructor(private auth: AngularFireAuth, private afs: AngularFirestore, private router: Router) { 
      this.user$ = this.auth.authState.pipe( 
          switchMap(user => {
              if (user) {
                  return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
              } else {
                  return of(null);
              }

          }
      ));
  }

  async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      const credential = await this.auth.auth.signInWithPopup(provider);
      let r = this.updateUserData(credential.user);
      console.log(r);
      return this.router.navigate(["/home"]);
  }

  async signOut() {
      await this.auth.auth.signOut();
      return this.router.navigate(["/"]);
  }

  updateUserData(user) {
      return this.afs.doc<User>(`users/${user.uid}`).set(
      {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
      }, 
      {merge: true});
      //return this.router.navigate(["/home"]);
  }
}
