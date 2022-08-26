import { Component } from '@angular/core';
import { DateTimeService } from './services/date-time.service';
import { OceanOSService } from './services/ocean-os.service';

@Component({
  selector: 'oos-root',
  templateUrl: './oos.component.html',
  styleUrls: ['./oos.component.css']
})
export class OOSComponent {

    constructor( private oos:OceanOSService, private dts:DateTimeService) { 
      this.oos.settings().subscribe( u => this.dts.setSettings(u) );
    }

}
