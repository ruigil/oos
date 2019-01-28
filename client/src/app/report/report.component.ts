import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { Params } from 'ngx-onsenui';

@Component({
  selector: 'ons-page[report]',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private menuService: MenuService, private _params: Params) { }

  cardTitle: string = 'Custom Card';

  ngOnInit() { 
    if (this._params.data && this._params.data.cardTitle)
      this.cardTitle = this._params.data.cardTitle;
  }

  openMenu() {
    this.menuService.open();
  }


}
