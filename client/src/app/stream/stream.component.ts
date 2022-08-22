import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, Observable, switchMap, take } from 'rxjs';
import { Drop } from '../model/drop';
import { Tag } from '../model/tag';
import { OceanOSService } from '../services/ocean-os.service';

@Component({
  selector: 'oos-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent {
  drops$: Observable<Drop[]>;
  tagsSelected: Map<string,Tag> = new Map();
  tagsAvailable: Map<string,Tag> = new Map();
  stream: Tag = new Tag();

  constructor(private oos: OceanOSService, private route: ActivatedRoute, ) { 
    this.drops$ = combineLatest([this.oos.tags(),this.route.paramMap]).pipe( mergeMap( v => {
      this.stream = this.oos.getTag(`${v[1].get("id")}_STREAM`);
      this.tagsSelected.set(this.stream._id, this.stream);
      return this.getStream();
    }));
  }

  selectTag(tag: Tag) {
    if (tag._id == this.stream._id) return;
    if (this.tagsSelected.has(tag._id)) {
      this.tagsSelected.delete(tag._id);
    } else {
      this.tagsAvailable.delete(tag._id);
      this.tagsSelected.set(tag._id, tag);
    }
    this.drops$ = this.getStream();
  }

  private getStream() {
    return this.oos.getStream( this.stream.uid, [...this.tagsSelected.keys()] ).pipe( map( ds => {
      const dt = ds.map( d => new Drop({ ...d, tags: d.tags.filter(t => t.type != "STREAM").map( t => new Tag({...t, icon: this.oos.getTagIC(t.type)?.icon, color:  this.oos.getTagIC(t.type)?.color }) )}) );
      this.tagsAvailable.clear();
      dt.forEach( d => d.tags.forEach( t => { if ((t.type !== 'STREAM') && (!this.tagsSelected.get(t._id))) this.tagsAvailable.set(t._id, t) } ));
      return dt;
    }));
  }

}
