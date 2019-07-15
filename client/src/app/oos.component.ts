import { Component, OnInit, ViewChild  } from '@angular/core';
import { AuthService } from './services/auth.service';
import { MenuService } from './services/menu.service';

@Component({
  selector: 'oos-root',
  templateUrl: './oos.component.html',
  styleUrls: ['./oos.component.css']
})
export class OOSComponent implements OnInit {
    @ViewChild("sidenav") sidenav: any;

    public pages = [
        {
            title: 'Home',
            url: '/home',
            icon: 'home'
        },
        {
            title: 'Analytics',
            url: '/analytics',
            icon: 'assessment'
        },
        {
            title: 'Tags',
            url: '/tags/edit',
            icon: 'bookmarks'
        },
        {
            title: 'Settings',
            url: '/settings',
            icon: 'settings'
        },
        {
            title: 'Account',
            url: '/login',
            icon: 'person'
        }
    ];

  constructor( public auth: AuthService, public menu: MenuService) { }

  ngOnInit() {
      this.menu.setSidenav(this.sidenav);

  }

}
