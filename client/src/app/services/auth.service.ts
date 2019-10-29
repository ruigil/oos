import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Observable, of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { User } from '../model/user';
import { FireService } from './fire.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ : Observable<any>;

  constructor(private auth: AngularFireAuth, private router: Router) { 
      this.user$ = this.auth.authState.pipe( switchMap(user => of(user) ));
  }

  user() {return this.user$; }

/*
  async googleSignin() {
      const provider = new auth.GoogleAuthProvider();
      console.log("login in user");
      const credential = await this.auth.auth.signInWithPopup(provider);
      console.log("setting user");

      return this.fireService.doc<User>(`users/${credential.user.uid}`).set(
        {
            uid: credential.user.uid,
            email: credential.user.email,
            displayName: credential.user.displayName,
            settings: { transaction: { currency: 'CHF'}, home: { preview: 'day', timezone: -2}, system: { day: true, analytics: true } }
        }
      ).then( (success) => this.router.navigate(["/home"]) );
  }

  async signOut() {
      console.log("signout");
      await this.auth.auth.signOut();
      return this.router.navigate(["/"]);
  }
  */

}
