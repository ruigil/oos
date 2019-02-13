import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Label } from '../label';
import { TagFilterService } from '../tag-filter.service';

@Component({
  selector: 'oos-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {
  tags: Array<{ name: string, count: number, selected: boolean}> = [];
  tagCount: number = 0;
  dropCount: number = 500;
  searchTerm: string = "";

  constructor(private fireService: FireService, private tagFilterService: TagFilterService) {
  }

  ngOnInit() {
    this.fireService.colWithIds$("labels").subscribe( (tags:Label[]) => {
        this.tags = tags.map( l => Object.create({ name: l.name, count: 10, selected: false }) );
    });
    this.tagFilterService.tagSelection(this.tags.filter( t => t.selected ).map( t => t.name ));
  }

  selectTag(i) {
    // cant select from indices, results in error, use id from real tag.
    this.tags[i].selected = !this.tags[i].selected;
    this.tagCount += this.tags[i].selected ? 1 : -1;
    this.tags = this.tags.slice(0);
    this.tagFilterService.tagSelection(this.tags.filter( t => t.selected ).map( t => t.name ));
  }

}
