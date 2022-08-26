import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'oos-skin',
  templateUrl: './oos-skin.component.html',
  styleUrls: ['./oos-skin.component.scss']
})
export class OOSSkinComponent {
  @Input()
  skin: string = "";

  constructor(private oos: OceanOSService ) { 
  }

}
