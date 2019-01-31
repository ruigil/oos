import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
    labelName: string = "";
    labels = ["Test1","Color","Main","Project","Life"];
  constructor() { }

  ngOnInit() {
  }

}
