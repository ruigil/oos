import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from 'src/app/model/drop';
import { DropMoney } from './drop-money';

@Component({
  selector: 'oos-drop-money',
  templateUrl: './drop-money.component.html',
  styleUrls: ['./drop-money.component.scss']
})
export class DropMoneyComponent implements OnInit {
  @Input() drop:DropMoney = new DropMoney();
  @Input() public: boolean = false;
  @Input() colors: {[key: string]: string} = { 'background-color': "", 'color': "" };

  constructor(
    private router: Router, 
    private oos:OceanOSService) { }

  ngOnInit(): void {
  }

  edit() {
    this.router.navigate(['/drop/money/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
