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
    @Output() onSelectTag = new EventEmitter<string[]>();
    tagName: string = "";
    tags: Tag[] = [];
    @Input() selected: Array<string> = [];
    available: Array<string> = [];

    constructor(private fireService: FireService) {
    }

    ngOnInit() {
      this.fireService.colWithIds$("tags").subscribe( (tags:Tag[]) => {
          this.tags = tags;
          this.available = tags.map( l => l.name);
          this.available = this.available.filter( l => !this.selected.includes(l));
      });
    }

    deleteTag(tagId:string) {
      this.fireService.delete("tags/"+tagId).then( () => console.log(tagId + " deleted.") );
    }

    addTag() {
      this.fireService.add("tags",{ name: this.tagName, count: 0 });
      if (!this.mode) {
        this.selected.push(this.tagName);
        this.available = this.available.filter( l => l != this.tagName);
      }
      this.tagName = "";
    }

    selectTag(i) {
      this.selected.push(this.available[i]);
      this.available.splice(i,1);
      this.onSelectTag.emit(this.selected);
    }

    unselectTag(i) {
      this.available.push(this.selected[i]);
      this.selected.splice(i,1);
      this.onSelectTag.emit(this.selected);
    }

}
