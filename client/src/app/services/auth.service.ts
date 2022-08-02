import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Subject, Observable, of, ReplaySubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
    user$ : ReplaySubject<any> = new ReplaySubject<any>(1);
    //user$ : Observable<any>;

  constructor(private router: Router) { 

  } 

  user() { 
      return this.user$;  
    } 


}
