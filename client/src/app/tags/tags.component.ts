import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FireService } from '../services/fire.service';
import { Tag } from '../model/tag';
import { AuthService } from '../services/auth.service';
import { Observable, Subscription } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'oos-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, OnDestroy {
    @Input() mode: boolean = true;
    @Output() onSelectTag = new EventEmitter<string[]>();
    tagName: string = "";
    tagColor: string = "dark";
    tags: Array<{ id: string, name: string, color: string, count: number, available: boolean}> = [];
    @Input() selected: Array<string> = [];
    available: Array<string> = [];
    subs: Subscription = new Subscription();
    public colors:Array<any> = [ 
        {name: "Dark", value:"dark"},
        {name: "Red", value:"red"},
        {name: "Blue", value:"blue"},
        {name: "Green", value:"green"},
        {name: "Yellow", value:"yellow"}
    ];
    

    constructor(private fireService: FireService, private authService: AuthService) {
    }

    ngOnInit() {
      this.subs.add(
        this.authService.user().pipe(  
            filter( u => u != null), 
            switchMap( u => this.fireService.colWithIds$("tags", ref => ref.where("uid","==",u.uid).orderBy('updatedAt','desc')) ) 
        ).subscribe( (tags:Tag[]) => {
            this.tags = tags.map( t => ({ id: t.id, name: t.name, color: t.color, count: t.count, available: !this.selected.includes(t.name)}) );
        })
      );
    }

    deleteTag(tagId:string) {
      this.fireService.delete("tags/"+tagId).then( () => console.log(tagId + " deleted.") );
    }

    addTag() {
        const ta = this.tags.filter( t => t.name === this.tagName );
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

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
