import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public appPages = [
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
      url: '/home',
      icon: 'settings'
    }
  ];

  constructor() {
  }

}
