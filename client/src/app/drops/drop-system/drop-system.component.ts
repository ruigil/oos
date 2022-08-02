import { Component, Input, OnInit } from '@angular/core';
import { Drop } from 'src/app/model/drop';
import { DateTimeService } from 'src/app/services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';

@Component({
  selector: 'oos-drop-system',
  templateUrl: './drop-system.component.html',
  styleUrls: ['./drop-system.component.scss']
})
export class DropSystemComponent implements OnInit {
  @Input() drop:Drop = new Drop();
  constructor(private oos:OceanOSService) { }

  ngOnInit(): void {
  }
  
}
