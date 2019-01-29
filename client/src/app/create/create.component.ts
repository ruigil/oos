import { Component, OnInit } from '@angular/core';
import { MenuService } from '../menu.service';
import { DropsService } from '../drops.service';
import { Drop } from '../drop';

@Component({
  selector: 'ons-page[create]',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  
  drop: Drop = new Drop();

  constructor(
    private dropsService: DropsService, 
    private menuService: MenuService, 
    ) { }

  ngOnInit() { 
    this.drop.text = "Enter the text...";
    this.drop.type = "NONE";
  }

  addTask() {
    //this.dropsService.createDrop(this.drop).then( () => this._navigator.element.popPage() );
  }

  openMenu() {
    this.menuService.open();
  }

}
