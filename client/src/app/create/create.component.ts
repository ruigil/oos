import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';

@Component({
  selector: 'ons-page[create]',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  
  drop: Drop = new Drop();

  constructor(
    private dropsService: FireService, 
    ) { }

  ngOnInit() { 
    this.drop.text = "Enter the text...";
    this.drop.type = "NONE";
  }

  addTask() {
    //this.dropsService.createDrop(this.drop).then( () => this._navigator.element.popPage() );
  }

}
