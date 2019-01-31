import { Component, ViewChild } from '@angular/core';
import { MenuService } from './menu.service';
import { MenuComponent } from './menu/menu.component';
//import { HomeComponent } from './home/home.component';
import { CreateComponent } from './create/create.component';

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
      title: 'Labels',
      url: '/labels',
      icon: 'pricetags'
    },
    {
      title: 'Settings',
      url: '/settings',
      icon: 'settings'
    }
  ];



  @ViewChild('splitter') private splitter;
  @ViewChild('navigator') private navigator;

  menu = MenuComponent;
  //content = HomeComponent;  
  
  constructor(private menuService: MenuService) {
    this.menuService.menu$.subscribe( op => op == "open"? this.splitter.nativeElement.side.open(): this.splitter.nativeElement.side.close());
    this.menuService.page$.subscribe( page => {
      this.menuService.close();
      this.navigator.nativeElement.resetToPage(page, {animation: 'fade', data: {aaa: 'bbb'}});
    });
  }

  alert() {
    //ons.notification.alert('Hello, world!');
  }  

  init() {
    console.log(" page init !");
  }  

  onClick() {
    //ons.notification.alert('FAB Clicked !');
  }  
}
