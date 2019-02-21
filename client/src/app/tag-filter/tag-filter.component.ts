import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Tag } from '../tag';
import { TagFilterService } from '../tag-filter.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'oos-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {
  tagCount: number = 0;
  dropCount: number = 500;
  searchTerm: string = "";
  tagsObs: Observable<Tag[]>;
  selectedTags: string[] = [];

  constructor(private fireService: FireService, private tagFilterService: TagFilterService) {
  }

  ngOnInit() {
    this.tagFilterService.select().subscribe( tags => {this.selectedTags = tags; this.tagsObs = this.tagFilterService.tags() } );
    //this.tagFilterService.select().subscribe( selectTags => 
      //this.tagsObs = this.tagFilterService.tags().pipe( map( (tags:Tag[]) => tags.map( t => ({...t, selected: selectTags.includes(t.name) }) ) ) ) );
    this.tagsObs = this.tagFilterService.tags();
  }

  selectTag(id) {
    if (!this.selectedTags.includes(id)) this.selectedTags.push(id);
    else this.selectedTags.splice(this.selectedTags.indexOf(id),1);
    console.log("selected tags:")
    console.log(this.selectedTags);

    this.tagFilterService.selectTag(this.selectedTags);
  }

}
