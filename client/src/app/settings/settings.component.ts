import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { OnsNavigator, Params } from 'ngx-onsenui';

@Component({
  selector: 'ons-page[settings]',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private menuService: MenuService, private _navigator: OnsNavigator, private _params: Params) { 
  }

  openMenu() {
    this.menuService.open();
  }

  ngOnInit() {
  }

}
