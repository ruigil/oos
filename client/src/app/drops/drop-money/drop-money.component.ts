import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from 'src/app/model/drop';

@Component({
  selector: 'oos-drop-money',
  templateUrl: './drop-money.component.html',
  styleUrls: ['./drop-money.component.scss']
})
export class DropMoneyComponent implements OnInit {
  @Input() drop:Drop = new Drop();

  constructor(
    private router: Router, 
    private oos:OceanOSService) { }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/money/edit', this.drop.id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
