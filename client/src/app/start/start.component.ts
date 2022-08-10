import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';

@Component({
  selector: 'oos-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss']
})
export class StartComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion = new MatAccordion();
  drops: Array<number> = [...Array(1).keys()];
  constructor() { 

  }

  ngOnInit() {
  }

}
