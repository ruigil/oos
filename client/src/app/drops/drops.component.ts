import { Component, Input, OnInit } from '@angular/core';
import { Drop } from '../model/drop';

@Component({
  selector: 'oos-drop',
  templateUrl: './drops.component.html',
  styleUrls: ['./drops.component.scss']
})
export class DropsComponent implements OnInit {
  @Input() drop: Drop = new Drop();
  @Input() public: boolean = false;
  @Input() colors: {[key: string]: string} = { 'background-color': "", 'color': "" };

  constructor() { }

  ngOnInit(): void {
  }

}
