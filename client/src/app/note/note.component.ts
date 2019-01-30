import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DropsService } from '../drops.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  text: string = "This is a test";

  constructor(private dropsService: DropsService, private router: Router) { }

  ngOnInit() {
  }

  addNote() {
    console.log("add note");
    this.dropsService.add("drops",{ text: this.text, type: "none"});
    this.router.navigate(["/home"]);
  }

}
