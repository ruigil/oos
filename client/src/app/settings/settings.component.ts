import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';


@Component({
  selector: 'ons-page[settings]',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private menuService: MenuService) { 
  }

  openMenu() {
    this.menuService.open();
  }

  ngOnInit() {
  }

}
