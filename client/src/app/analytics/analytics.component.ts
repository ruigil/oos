import { Component, OnInit, Injector } from '@angular/core';
import { ReportComponent } from '../report/report.component';
import { MenuService } from '../menu.service';

@Component({
  selector: 'analytics-page',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

  constructor(private menuService: MenuService) { }


  ngOnInit() {
  }

}
