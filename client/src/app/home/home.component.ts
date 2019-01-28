import { Component, OnInit } from '@angular/core';
import { CreateComponent } from '../create/create.component';
import { MenuService } from '../menu.service';
import { DropsService } from '../drops.service';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { Drop } from '../drop';

@Component({
  selector: 'ons-page[home]',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  drops: Drop[];
  
  constructor(private dropsService: DropsService, private menuService: MenuService, private _navigator: OnsNavigator, private _params: Params) { 
  }

  openMenu() {
    this.menuService.open();
  }

  push() {
    this._navigator.element.pushPage(CreateComponent, { data: { title: "New Task" } });
  }
  
  alert() {
    console.log("alert");
  }

  ngOnInit() {
    this.dropsService.getDrops().subscribe( drops => this.drops = drops);
  }

}
