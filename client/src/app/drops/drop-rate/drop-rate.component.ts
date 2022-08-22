import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Drop } from 'src/app/model/drop';
import { OceanOSService } from 'src/app/services/ocean-os.service';

@Component({
  selector: 'oos-drop-rate',
  templateUrl: './drop-rate.component.html',
  styleUrls: ['./drop-rate.component.scss']
})
export class DropRateComponent implements OnInit {
  @Input() drop:Drop = new Drop();

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
    this.router.navigate(['/rate/edit', this.drop._id]);
  }

  delete() {
    this.oos.deleteDrop(this.drop);
  }

}
