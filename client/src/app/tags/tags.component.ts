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
    tagColor: string = "dark";
    tags: Array<{ name: string, color: string, available: boolean}> = [];
    @Input() selected: Array<string> = [];
    available: Array<string> = [];

    constructor(private fireService: FireService) {
    }

    ngOnInit() {
      this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc')).subscribe( (tags:Tag[]) => {
          this.tags = tags.map( t => ({ name: t.name, color: t.color, available: !this.selected.includes(t.name)}) );
      });
    }

    deleteTag(tagId:string) {
      this.fireService.delete("tags/"+tagId).then( () => console.log(tagId + " deleted.") );
    }

    addTag() {
      this.fireService.set("tags/"+this.tagName.toLocaleUpperCase(),{ name: this.tagName.toLocaleUpperCase(), count: 0, color: this.tagColor });
      if (!this.mode) {
        this.selected.push(this.tagName);
      }
      this.tagName = "";
    }

    tagsAvailable() {
        return this.tags.filter( t => t.available);
    }

    tagsSelected() {
        return this.tags.filter( t => !t.available);
    }

    selectTag(name) {
        this.tags = this.tags.map( t => ({...t, available: t.name === name ? false : t.available}) )
        this.onSelectTag.emit(this.tags.filter(t => !t.available).map( t => t.name) );
    }

    unselectTag(name) {
        this.tags = this.tags.map( t => ({...t, available: t.name === name ? true : t.available}) )
        this.onSelectTag.emit(this.tags.filter(t => !t.available).map( t => t.name) );
    }

    colorChoice($event) {
        this.tagColor = $event.detail.value;
    }

}
