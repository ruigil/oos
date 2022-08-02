import { Component, OnInit, ViewChild  } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'oos-root',
  templateUrl: './oos.component.html',
  styleUrls: ['./oos.component.css']
})
export class OOSComponent implements OnInit {

    constructor( public auth: AuthService) { }

    ngOnInit() {
    }

}
