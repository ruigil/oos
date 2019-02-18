import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FireService } from '../fire.service';
import { Tag } from '../tag';

@Component({
  selector: 'oos-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
    @Input() mode: boolean = true;
    @Output() onSelectLabel = new EventEmitter<string[]>();
    labelName: string = "";
    labels: Tag[] = [];
    @Input() selected: Array<string> = [];
    available: Array<string> = [];

    constructor(private fireService: FireService) {
    }

    ngOnInit() {
      this.fireService.colWithIds$("labels").subscribe( (lbls:Tag[]) => {
          this.labels = lbls;
          this.available = lbls.map( l => l.name);
          this.available = this.available.filter( l => !this.selected.includes(l));
      });
    }

    deleteLabel(labelId:string) {
      this.fireService.delete("labels/"+labelId).then( () => console.log(labelId + " deleted.") );
    }

    addLabel() {
      this.fireService.add("labels",{ name: this.labelName });
      if (!this.mode) {
        this.selected.push(this.labelName);
        this.available = this.available.filter( l => l != this.labelName);
      }
      this.labelName = "";
    }

    selectLabel(i) {
      this.selected.push(this.available[i]);
      this.available.splice(i,1);
      this.onSelectLabel.emit(this.selected);
    }

    unselectLabel(i) {
      this.available.push(this.selected[i]);
      this.selected.splice(i,1);
      this.onSelectLabel.emit(this.selected);
    }

}
