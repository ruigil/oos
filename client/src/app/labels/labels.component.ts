import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
    labelName: string = "";
    labelColor: string = "primary";
    labels;

  constructor(private fireService: FireService) { }

  ngOnInit() {
    this.labels = this.fireService.colWithIds$("labels");
  }

  deleteLabel(labelId:string) {
    this.fireService.delete("labels/"+labelId).then( () => console.log(labelId + " deleted.") );
  }

  addLabel() {
    console.log(this.labelName);
    console.log(this.labelColor);
    this.fireService.add("labels",{ name: this.labelName, color: this.labelColor });
  }

}
