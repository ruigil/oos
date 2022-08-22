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
  uid: string = "";
  streamId: string = "";
  streamName: string = "";
  tagsIC: Map<string,{icon: string, color: string}> = new Map(
    [
      ["STREAM", {icon: "stream", color: "stream-icon"}],
      ["NOTE", {icon: "note", color: "note-icon"}],
      ["PHOTO", {icon: "photo_camera", color: "photo-icon"}],
      ["TASK", {icon: "task", color: "task-icon"}],
      ["RATE", {icon: "rate", color: "rate-icon"}],
      ["GOAL", {icon: "flag_circle", color: "goal-icon"}],
      ["MONEY", {icon: "money", color: "money-icon"}],
      ["SYS",{icon:"smart_toy",color:"system-icon"}],    
      ["USER1",{icon:"bookmark",color:"dark"}],
      ["USER2",{icon:"bookmark",color:"light"}],
      ["USER3",{icon:"bookmark",color:"red"}],
      ["USER4",{icon:"bookmark",color:"blue"}],
      ["USER5",{icon:"bookmark",color:"green"}],
      ["USER6",{icon:"bookmark",color:"yellow"}]  
    ]
  );

  constructor(private oos: OceanOSService, private route: ActivatedRoute, ) { 
    this.drops$ = this.route.paramMap.pipe( mergeMap( v => {
      this.uid = v.get('uid') || "";
      this.streamName = v.get('id') || "";
      this.streamId = `${this.streamName}_STREAM`;
      this.tagsSelected.set(this.streamId, new Tag({_id: this.streamId, name: this.streamName, type: "STREAM", icon: 'stream', color: 'stream-icon'}));
      return this.oos.getStream( this.uid, [...this.tagsSelected.keys()] ).pipe( map( ds => {
        const dt = ds.map( d => new Drop({ ...d, tags: d.tags.map( t => new Tag({...t, icon: this.tagsIC.get(t.type)?.icon, color:  this.tagsIC.get(t.type)?.color }) )}) );
        this.tagsAvailable = new Map<string,Tag>();
        dt.forEach( d => d.tags.forEach( t => { if ((t.type !== 'STREAM') && (!this.tagsSelected.get(t._id))) this.tagsAvailable.set(t._id, t) } ));
        return dt;
      }));
    }));
  }

  selectTag(tag: Tag) {
    if (tag._id == this.streamId) return;
    if (this.tagsSelected.has(tag._id)) {
      this.tagsSelected.delete(tag._id);
    } else {
      this.tagsAvailable.delete(tag._id);
      this.tagsSelected.set(tag._id, tag);
    }
    this.drops$ = this.oos.getStream( this.uid, [...this.tagsSelected.keys()] ).pipe( map( ds => {
      const dt = ds.map( d => new Drop({ ...d, tags: d.tags.map( t => new Tag({...t, icon: this.tagsIC.get(t.type)?.icon, color:  this.tagsIC.get(t.type)?.color }) )}) );
      this.tagsAvailable = new Map<string,Tag>();
      dt.forEach( d => d.tags.forEach( t => { if ((t.type !== 'STREAM') && (!this.tagsSelected.get(t._id)) ) this.tagsAvailable.set(t._id, t) } ));
      return dt;
    }));
  }

}
