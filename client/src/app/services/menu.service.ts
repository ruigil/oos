import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
    menu: any;

  constructor() { }

  setSidenav(sideNav: any) {
      this.menu = sideNav;
  }

  toggle() {
      this.menu.toggle();
  }
}
