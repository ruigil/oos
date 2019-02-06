import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireService } from '../fire.service';
import { LabelsComponent } from '../labels/labels.component';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  text: string = "";

  constructor(private dropsService: FireService, private router: Router) { }

  ngOnInit() {
  }

  addNote() {
    console.log("add note");
    this.dropsService.add("drops",{ text: this.text, type: "none"});
    this.router.navigate(["/home"]);
  }

}
