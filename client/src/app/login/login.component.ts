import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService) { 
      auth.user$.subscribe( user => user ? console.log(user.email) : console.log("login") );      
  }

  ngOnInit() {
  }

}
