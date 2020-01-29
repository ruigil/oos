import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';

import { Subject, Observable, of, ReplaySubject} from 'rxjs';
import { switchMap, tap, shareReplay, share, map, distinctUntilChanged } from 'rxjs/operators'; 
import { User } from '../model/user';
import { FireService } from './fire.service';
import { AuthProcessService } from 'ngx-auth-firebaseui'; 


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ : ReplaySubject<any> = new ReplaySubject<any>(1);
    //user$ : Observable<any>;

  constructor(private auth: AngularFireAuth, private router: Router) { 
      /*
    this.user$ = this.auth.authState.pipe( 
        //distinctUntilChanged(), 
        map( u => u === null ? {} : u),
        tap( u => { console.log("New user logged in authservice"); console.log(u) }),  
        shareReplay()
        );
*/
    this.auth.authState.pipe( 
        //distinctUntilChanged(), 
        map( u => u === null ? {} : u),
        tap( u => { console.log("New user logged in authservice"); console.log(u) }),  
     ).subscribe( u => this.user$.next(u) );

  } 

  user() { 
      return this.user$;  
    } 


}
