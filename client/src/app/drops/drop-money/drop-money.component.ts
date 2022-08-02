import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { DateTimeService } from 'src/app/services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';

@Component({
  selector: 'oos-drop-money',
  templateUrl: './drop-money.component.html',
  styleUrls: ['./drop-money.component.scss']
})
export class DropMoneyComponent implements OnInit {
  @Input() drop:Drop = new Drop();

  constructor(
    private router: Router, 
    private oos:OceanOSService,
    private dts:DateTimeService) { }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/money/edit', this.drop.id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
