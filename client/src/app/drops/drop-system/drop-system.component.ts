import { Component, Input, OnInit } from '@angular/core';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { DropSystem } from './drop-system';

@Component({
  selector: 'oos-drop-system',
  templateUrl: './drop-system.component.html',
  styleUrls: ['./drop-system.component.scss']
})
export class DropSystemComponent implements OnInit {
  @Input() drop:DropSystem = new DropSystem();
  @Input() public: boolean = false;
  @Input() colors: {[key: string]: string} = { 'background-color': "", 'color': "" };


  constructor(private oos:OceanOSService) { }

  ngOnInit(): void {
  }
  
}
