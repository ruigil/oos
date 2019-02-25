import { Component, OnInit } from '@angular/core';
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

  constructor(private tagFilterService: TagFilterService) {
  }

  ngOnInit() {
    this.tagsObs = this.tagFilterService.tags().pipe( map( (tags:Tag[]) => tags.map( t =>  ( {...t, selected: this.selectedTags.includes(t.name)} ) )));
  }

  selectTag(id) {
    if (!this.selectedTags.includes(id)) this.selectedTags.push(id);
    else this.selectedTags.splice(this.selectedTags.indexOf(id),1);
    console.log("selected tags:")
    console.log(this.selectedTags);
    this.tagFilterService.selectTag(this.selectedTags);
  }

}
