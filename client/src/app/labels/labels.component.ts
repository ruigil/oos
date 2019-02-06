import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FireService } from '../fire.service';

@Component({
  selector: 'oos-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
    @Input() mode: boolean = true;
    labelName: string = "";
    labelColor: string = "primary";
    labels;
    @Output() onLabel = new EventEmitter<string>();

    constructor(private fireService: FireService) { 
    }

    ngOnInit() {
      this.labels = this.fireService.colWithIds$("labels");
      console.log(this.labels);
    }

    deleteLabel(labelId:string) {
      this.fireService.delete("labels/"+labelId).then( () => console.log(labelId + " deleted.") );
    }

    addLabel() {
      console.log(this.labelName);
      console.log(this.labelColor);
      this.fireService.add("labels",{ name: this.labelName, color: this.labelColor });
    }

    selectColor(color) {
      this.labelColor = color.detail.value;
      console.log(this.labelColor);
    }

    pushLabel(id) {
      console.log("push label..." + id)
      this.onLabel.emit(id);
    }

}
