import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireService } from '../fire.service';
import { Drop } from '../drop';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

    drop: Drop = new Drop();

  constructor(private dropsService: FireService, private router: Router) { 
    this.drop.labels = [];
    this.drop.type = "NOTE";
    this.drop.text = "";
  }

  ngOnInit() {
  }

  addNote() {
    console.log("add note");
    this.dropsService.add("drops",this.drop);
    this.router.navigate(["/home"]);
  }
  
  selectedLabels(labels: Array<string>) {
    console.log(" add labels");
    this.drop.labels = labels;
  }

}
