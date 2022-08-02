import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeleteTagDialog } from './DeleteTagDialog';

import { OceanOSService } from '../services/ocean-os.service';
import { Tag } from '../model/tag';

@Component({
  selector: 'oos-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() onSelectTag = new EventEmitter<Tag[]>();
    @Input() selected: Array<Tag> = [];
    currentTag: Tag = new Tag( { id: "", name: "", icon: 'bookmark', color: 'dark'});
    update:boolean = false;
    unselectedTags: Observable<Tag[]>;
    selectedTags: Observable<Tag[]>;
    public colors:Array<any> = [ 
        {name: "Dark", value:"dark"},
        {name: "Light", value:"light"},
        {name: "Red", value:"red"},
        {name: "Blue", value:"blue"},
        {name: "Green", value:"green"},
        {name: "Yellow", value:"yellow"}
    ];

    constructor(private oss: OceanOSService, private dialog:MatDialog) {
        this.selectedTags = this.oss.selectedTags();
        this.unselectedTags = this.oss.unselectedTags();

        this.selectedTags.subscribe( (ts:Tag[]) => this.onSelectTag.emit(ts ) );
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.oss.clearTagSelection();
        this.selected.map( (t:Tag) => this.oss.selectTag(t) )
    }

    deleteTag(tag:Tag) {
        const dialogRef = this.dialog.open(DeleteTagDialog, {
            width: '350px',
            data: {tag: tag.name },
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.oss.deleteTag(tag).then( () => console.log(tag.name + " deleted") );
          });    
    }

    newTag() {
        const tagName = this.currentTag.name.toLocaleUpperCase();
        const tag:Tag = new Tag({ id:tagName, name: tagName, count: 0, color: this.currentTag.color, icon: 'bookmark' }); 
        this.oss.putTag(tag);
    }
    
    selectTag(tag:Tag) {
        this.oss.selectTag(tag);
    }

    unselectTag(tag:Tag) {
        if (!tag.id.endsWith("_TYPE")) this.oss.unselectTag(tag);
    }

    colorChoice($event:any) {
        this.currentTag.color = $event.detail.value;
    }

    ngOnDestroy() {
    }

}
