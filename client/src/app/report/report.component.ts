import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';


@Component({
  selector: 'ons-page[report]',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private menuService: MenuService) { }

  cardTitle: string = 'Custom Card';

  ngOnInit() { 
  }

  openMenu() {
    this.menuService.open();
  }


}
