import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FireService } from '../fire.service';

@Component({
  selector: 'oos-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.scss']
})
export class LabelsComponent implements OnInit {
    @Input() mode: boolean = true;
    @Output() onLabel = new EventEmitter<string>();
    labelName: string = "";
    labels: Array<{ id: string, name: string, active: boolean}> = [];

    constructor(private fireService: FireService) { 
    }

    ngOnInit() {
      this.fireService.colWithIds$("labels").subscribe( labels => {
          this.labels = [];
          for (let i=0; i<labels.length; i++) {
              this.labels.push({ id: labels[i].id, name: labels[i].name, active: true});
          }
      });
      console.log(this.labels);
    }

    deleteLabel(labelId:string) {
      this.fireService.delete("labels/"+labelId).then( () => console.log(labelId + " deleted.") );
    }

    addLabel() {
      console.log(this.labelName);
      this.fireService.add("labels",{ name: this.labelName });
    }

    pushLabel(id) {
      console.log("push label..." + id)
      this.onLabel.emit(id);
    }

}
