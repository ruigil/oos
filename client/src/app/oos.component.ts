import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'oos-root',
  templateUrl: './oos.component.html',
  styleUrls: ['./oos.component.css']
})
export class OOSComponent {
opened: boolean;
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

  constructor( public auth: AuthService) { }

}
