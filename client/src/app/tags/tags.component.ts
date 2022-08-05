import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, AfterViewInit, SimpleChanges } from '@angular/core';
import { Observable, first, mapTo, map } from 'rxjs';
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

    constructor(private oos: OceanOSService, private dialog:MatDialog) {

        this.selectedTags = this.oos.selectedTags();
        this.unselectedTags = this.oos.unselectedTags();

        this.selectedTags.subscribe( (ts:Tag[]) => this.onSelectTag.emit(ts ) );
    }
    
    ngOnChanges(changes: SimpleChanges) {
        const previous = changes['selected'].previousValue || [];
        const current = changes['selected'].currentValue;
        if ((!changes['selected'].firstChange) && ((current.length != previous.length))) {
            this.oos.clearTagSelection();
            this.selected.map( (t:Tag) => this.oos.selectTag(t) )
        }        
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.oos.clearTagSelection();
        this.selected.map( (t:Tag) => this.oos.selectTag(t) )
    }

    deleteTag(tag:Tag) {
        const dialogRef = this.dialog.open(DeleteTagDialog, {
            width: '350px',
            data: {tag: tag.name },
          });
      
          dialogRef.afterClosed().subscribe(result => {
            if (result)
                this.oos.deleteTag(tag).then( () => console.log(tag.name + " deleted") );
          });    
    }

    newTag() {
        const tagName = this.currentTag.name.toLocaleUpperCase();
        const tag:Tag = new Tag({ id:tagName, name: tagName, count: 0, color: this.currentTag.color, icon: 'bookmark' }); 
        this.oos.putTag(tag);
    }
    
    selectTag(tag:Tag) {
        if (tag) this.oos.selectTag(tag);
    }

    unselectTag(tag:Tag) {
        if (!tag.id.endsWith("_TYPE")) this.oos.unselectTag(tag);
    }

    colorChoice($event:any) {
        this.currentTag.color = $event.detail.value;
    }

    ngOnDestroy() {
    }

}
