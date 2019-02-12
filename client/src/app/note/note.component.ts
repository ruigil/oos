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
    tags: Array<string> = ["Note"];

  constructor(private dropsService: FireService, private router: Router) { 
    this.drop.type = "NOTE";
    this.drop.text = "";
    this.drop.tags = { Note: true };
  }

  ngOnInit() {
  }

  addNote() {
    this.tags.forEach( t => this.drop.tags[t] = true);
    this.dropsService.add("drops",this.drop);
    this.router.navigate(["/home"]);
  }
  
  selectedLabels(labels: Array<string>) {
    this.tags = labels;
  }

}
