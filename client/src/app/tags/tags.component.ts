import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Tag } from '../model/tag';

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
    tags: Array<{ name: string, color: string, count: number, available: boolean}> = [];
    @Input() selected: Array<string> = [];
    available: Array<string> = [];
    public colors:Array<any> = [ 
        {name: "Dark", value:"dark"},
        {name: "Red", value:"red"},
        {name: "Blue", value:"blue"},
        {name: "Green", value:"green"},
        {name: "Yellow", value:"yellow"}
    ];

    

    constructor(private fireService: FireService) {
    }

    ngOnInit() {
      this.fireService.colWithIds$("tags", ref => ref.orderBy('updatedAt','desc')).subscribe( (tags:Tag[]) => {
          this.tags = tags.map( t => ({ name: t.name, color: t.color, count: t.count, available: !this.selected.includes(t.name)}) );
      });
    }

    deleteTag(tagId:string) {
      this.fireService.delete("tags/"+tagId).then( () => console.log(tagId + " deleted.") );
    }

    addTag() {
      const ta = this.tags.filter( t => t.name === this.tagName);
      const tagCount = ta.length == 0 ? 0 : ta[0].count;
      this.fireService.set("tags/"+this.tagName.toLocaleUpperCase(),{ name: this.tagName.toLocaleUpperCase(), count: tagCount, color: this.tagColor });
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
