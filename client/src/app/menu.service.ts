import { Injectable } from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  subject = new Subject();
  options:Subject<any>;
  pages = new Subject();

  constructor() { }
  
  get menu$(): Observable<any> {
    return this.subject.asObservable();
  }
  
  open() {
    this.subject.next("open");
  }

  close() {
    this.subject.next("close");
  }

  setPage(page: any) {
      this.pages.next(page);
  }

  get page$() { return this.pages.asObservable(); }

}
