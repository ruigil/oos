import { Component, OnInit } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { MenuService } from '../menu.service';

@Component({
  selector: 'ons-page[create]',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  constructor(private menuService: MenuService, private _navigator: OnsNavigator, private _params: Params) { }

  title: string = 'Custom Page';

  ngOnInit() { 
    if (this._params.data && this._params.data.title)
      this.title = this._params.data.title;
  }

  /*
  push() {
    this._navigator.element.pushPage(CreateComponent, { data: { title: this._navigator.element.topPage.querySelector('ons-input').value } });
  }
  */

  pop() {
    this._navigator.element.popPage();
  }

  openMenu() {
    this.menuService.open();
  }

}
