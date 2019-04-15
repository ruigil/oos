import { Component } from '@angular/core';

@Component({
  selector: 'oos-root',
  templateUrl: './oos.component.html',
  styleUrls: ['./oos.component.css']
})
export class OOSComponent {

  public pages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Analytics',
      url: '/analytics',
      icon: 'list'
    },
    {
      title: 'Tags',
      url: '/tags/edit',
      icon: 'pricetags'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }
  ];

  constructor() { }

}
