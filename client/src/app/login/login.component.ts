import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AuthProcessService } from 'ngx-auth-firebaseui';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
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
export class LoginComponent implements OnInit {
    user$ : Observable<User>;

  constructor(private auth: AuthService,private afs: AngularFirestore, private router: Router) { 
      //auth2.handleSuccess().then()
      //auth.user$.subscribe( user => user ? console.log(user.email) : console.log("login") );      
      //auth2.afa.authState.subscribe( user => console.log(user) );
      this.user$ = this.auth.user().pipe( tap( u => { console.log(" in the login component "); console.log(u); }));
 }

  ngOnInit() {
  }

  loggedIn(event) {
      console.log("logged in success");
      console.log(event);
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
