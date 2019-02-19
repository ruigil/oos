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
  tags: Array<string> = [];

  constructor(private dropsService: FireService, private router: Router) { 
    this.drop.text = "";
    this.tags.push("Note");
  }

  ngOnInit() {
  }

  addNote() {
    this.dropsService.add("drops",{ ...this.drop, tags: this.tags});
    this.router.navigate(["/home"]);
  }
  
  selectedTags(tags: Array<string>) {
    this.tags = tags;
  }

}
