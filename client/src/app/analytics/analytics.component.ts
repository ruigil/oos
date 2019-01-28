import { Component, OnInit, Injector } from '@angular/core';
import { OnsNavigator, Params } from 'ngx-onsenui';
import { ReportComponent } from '../report/report.component';
import { MenuService } from '../menu.service';

@Component({
  selector: 'ons-page[analytics]',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.css']
})
export class AnalyticsComponent implements OnInit {

  constructor(private menuService: MenuService, private _navigator: OnsNavigator) { }

  push(event) {
    this._navigator.element.pushPage(ReportComponent, { data: { cardTitle: event.target.textContent } });
  }

  openMenu() {
    this.menuService.open();
  }

  ngOnInit() {
  }

}
