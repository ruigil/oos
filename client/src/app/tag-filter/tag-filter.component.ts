import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Tag } from '../tag';
import { TagFilterService } from '../tag-filter.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'oos-tag-filter',
  templateUrl: './tag-filter.component.html',
  styleUrls: ['./tag-filter.component.css']
})
export class TagFilterComponent implements OnInit {
  tagCount: number = 0;
  dropCount: number = 500;
  searchTerm: string = "";
  tagsObs: Observable<Tag[]>

  constructor(private fireService: FireService, private tagFilterService: TagFilterService) {
  }

  ngOnInit() {
    this.tagFilterService.select().subscribe( () => this.tagsObs = this.tagFilterService.tags() );
    this.tagsObs = this.tagFilterService.tags();
  }

  selectTag(id) {
    this.tagFilterService.selectTag(id);
  }

}
