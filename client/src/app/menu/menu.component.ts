import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../settings/settings.component';
import { HomeComponent } from '../home/home.component';
import { AnalyticsComponent } from '../analytics/analytics.component';
import { Observable } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'ons-page[menu]',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  settings = SettingsComponent;
  home = HomeComponent;
  analytics = AnalyticsComponent;

  constructor(private menuService: MenuService) {
    //private _navigator: OnsNavigator, private _params: Params
    //console.log('parameters:', _params.data);
  }

  loadPage(page) {
    this.menuService.setPage(page);
    //this._navigator.nativeElement.resetToPage(page, { animation: 'fade' });
  }

  alert() {
    console.log("alert");
  }

  ngOnInit() {
  }

}
