import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OceanOSService } from 'src/app/services/ocean-os.service';
import { DropRate } from './drop-rate';


@Component({
  selector: 'oos-drop-rate',
  templateUrl: './drop-rate.component.html',
  styleUrls: ['./drop-rate.component.scss']
})
export class DropRateComponent implements OnInit {
  @Input() drop:DropRate = new DropRate();

  constructor(
    private oos: OceanOSService, 
    private router: Router) { }

  ngOnInit(): void {
  }

  rate(value:number, event: MouseEvent) {
    this.drop.content!.value = value;
    event.stopPropagation();
    this.oos.putDrop(this.drop);
  }  

  edit() {
    this.router.navigate(['/drop/rate/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
