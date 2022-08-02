import { Component, Input, OnInit } from '@angular/core';
import { Drop } from '../model/drop';

@Component({
  selector: 'oss-drops',
  templateUrl: './drops.component.html',
  styleUrls: ['./drops.component.scss']
})
export class DropsComponent implements OnInit {
  @Input() drop: Drop = new Drop();

  constructor() { }

  ngOnInit(): void {
  }

}
