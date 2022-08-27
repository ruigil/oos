import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'oos-skin',
  templateUrl: './oos-skin.component.html',
  styleUrls: ['./oos-skin.component.scss']
})
export class OOSSkinComponent implements AfterViewInit {
  @Output() onColor = new EventEmitter<{[key: string]: string}>();
  @Input() skin: string = "";
  bgColor: string = "#0d7594";

  constructor(private oos: OceanOSService ) { 
  }

  ngAfterViewInit() {
    this.onColor.emit({ 'background-color': '#08314b', 'color': '#fff' })
  }

}
