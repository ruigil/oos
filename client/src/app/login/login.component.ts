import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { Observable, of } from 'rxjs';
import { switchMap, tap, map } from 'rxjs/operators';
import { User } from '../model/user';
import {
    AngularFirestore,
    AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
    user$ : Observable<User>;
    logged: boolean;

  constructor(private auth: AuthService,private afs: AngularFirestore, private router: Router) { 
      //auth2.handleSuccess().then()
      //auth.user$.subscribe( user => user ? console.log(user.email) : console.log("login") );
      //auth2.afa.authState.subscribe( user => console.log(user) );
  }

  ngOnInit() {
      this.user$ = this.auth.user().pipe( tap(u => this.logged = !!u.uid), map( u => u.uid ? u : false) );  
  }

  ngAfterViewInit() {
  }

  loggedIn(event) {
      console.log("logged in");
      this.router.navigate(["/home"]);
  }

  signOut() {
  }

  authError() {
      console.log("error auth");
  }

  printError() {
      console.log("error not logged");
  }

  printUser(user) {
      console.log("user:");
      console.log(user);
  }

}
