import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'ons-page[report]',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor() { }

  cardTitle: string = 'Custom Card';

  ngOnInit() { 
  }


}
