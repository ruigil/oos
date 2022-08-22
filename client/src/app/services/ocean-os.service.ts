import { Injectable } from '@angular/core';
import { Subject, Observable, map, combineLatest, ReplaySubject, of } from 'rxjs';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";
import { DateTimeService } from './date-time.service';

import { HomeStream } from '../model/home-stream';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import {v4 as uuidv4} from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class OceanOSService {

  private tagsV: Map<string,Tag> = new Map();
  private tags$: Subject<Tag[]> = new ReplaySubject<Tag[]>(1);

  private dropsV: Map<string,Drop> = new Map();
  private drops$: Subject<Drop[]> = new ReplaySubject<Drop[]>(1);

  private settingsV: User = new User();
  private settings$: Subject<User> = new ReplaySubject<User>(1);

  private previewAt: number = 0;
  private startAt: number = 0;
  private tagsIC: Map<string,{icon:string,color:string}> = new Map([
    ["NOTE",{icon:"note",color:"note-icon"}],
    ["RATE",{icon:"star",color:"rate-icon"}],
    ["PHOTO",{icon:"photo",color:"photo-icon"}],
    ["GOAL",{icon:"flag_circle",color:"goal-icon"}],
    ["TASK",{icon:"task",color:"task-icon"}],
    ["MONEY",{icon:"money",color:"money-icon"}],
    ["STREAM",{icon:"stream",color:"stream-icon"}],
    ["SYS",{icon:"smart_toy",color:"system-icon"}],    
    ["USER1",{icon:"bookmark",color:"dark"}],
    ["USER2",{icon:"bookmark",color:"light"}],
    ["USER3",{icon:"bookmark",color:"red"}],
    ["USER4",{icon:"bookmark",color:"blue"}],
    ["USER5",{icon:"bookmark",color:"green"}],
    ["USER6",{icon:"bookmark",color:"yellow"}]
  ]);

  constructor(private dts:DateTimeService, private http:HttpClient) {

    // TODO: implement remote settings
    combineLatest([
      this.http.get<Tag[]>(`/api/tags`),
      this.http.get<Drop[]>(`/api/drops`),
      this.http.get<User>(`/api/user/oos`)])
      .subscribe( ([ts,ds,us]) => {
        this.tagsV = new Map( ts.map( t => new Tag({
          ...t, 
          available: true, 
          filtered: false, 
          selected: false,
          icon: this.tagsIC.get(t.type)!.icon,
          color: this.tagsIC.get(t.type)!.color
        })).map( t => [t._id,t]) );
        this.dropsV = new Map( ds.map( d => new Drop({
          ...d, 
          available: true,
          tags: d.tags.map( t => new Tag({...t, icon: this.tagsIC.get(t.type)!.icon, color: this.tagsIC.get(t.type)!.color}))
        })).map( d => [d._id,d]) );
        this.settingsV = us;
        this.settings$.next(this.settingsV);
        this.fromTime( { preview: this.settingsV.settings.home.preview, startAt:this.dts.startOfToday() });
      });
  }

  putSettings(settings: User):Promise<Object> {
    return new Promise( (resolve,reject) => {
      this.http.post(`/api/user`, settings).subscribe( u => {
        if (u) {
          this.settingsV = new User({...settings});
          this.settings$.next(this.settingsV);
          resolve(u);
        } else reject();
      });
    });
  }

  putTag(tag : Tag ): Promise<Object> {
    tag.uid = this.settingsV.id;
    return new Promise( (resolve,reject) => {
      this.http.post(`/api/tags`, tag).subscribe( r => {
        if (r) {
          this.tagsV.set( tag._id, tag );
          this.getTags();
          resolve(r);
        } else reject();
      });
    });
  }

  putDrop(drop:Drop):Promise<object> {
    drop.uid = this.settingsV.id;
    drop.color = this.previewColor(drop,this.startAt);
    if (drop._id === 'new') {
      drop._id = uuidv4();
    }
    return new Promise( (resolve,reject) => {
      this.http.post(`/api/drops`, drop).subscribe( (r:any) => {
        if (r) {
          //console.log(r);
          this.dropsV.set(drop._id, drop );
          this.getDrops();
          resolve(r);
        } else reject();
      });
    });
  }

  deleteTag(tag : Tag ): Promise<object> {
    return new Promise( (resolve,reject) => {
      this.http.delete(`/api/tags/${tag._id}`).subscribe( r => {
        if (r) {
          this.tagsV.delete( tag._id );
          for (let d of this.dropsV.values()) {
            d.tags = d.tags.filter( t => t._id !== tag._id);
          }
          this.getTags();
          resolve(r);
        } else reject();
      });
    });
  }

  deleteDrop(drop:Drop): Promise<object> {
    return new Promise( (resolve,reject) => {
      this.http.delete(`/api/drops/${drop._id}`).subscribe( r => {
        if (r) {
          this.dropsV.delete(drop._id);
          this.getDrops();
          resolve(r);
        } else reject();
      });
    });
  }

  tags():Observable<Tag[]> {
    return this.tags$;
  }
  
  drops():Observable<Drop[]> {
    return this.drops$;
  }
  
  settings():Observable<User> {
    return this.settings$;
  }

  filteredTags() {
    return this.tags$.pipe( map( tags => tags.filter( t => t.filtered) ) );
  }

  availableTags() {
    return this.tags$.pipe( map( tags => tags.filter( t => t.available) ) );
  }

  selectedTags() {
    return this.tags$.pipe( map( tags => tags.filter( t => t.selected) ) );
  }

  unselectedTags() {
    return this.tags$.pipe( map( tags => tags.filter(t => !t.selected && !t._id.endsWith("_TYPE") ) ) );
  }

  selectTag(tag: Tag) {
    const t = this.tagsV.get(tag._id) 
    if (t) {
      t.selected = true;
      this.getTags();
    }
  }
  unselectTag(tag: Tag) {
    const t = this.tagsV.get(tag._id) 
    if (t) {
      t.selected = false;
      this.getTags();
    }
  }

  initTagSelection(tags: Tag[]) {
    for (let t of this.tagsV.values()) {
      t.selected = tags.some(st => st._id === t._id)
    }
    this.getTags();
  }


  filterTag(tag: Tag) {
    const t = this.tagsV.get(tag._id) 
    if (t) {
      t.filtered = true;
      this.filterTagsDrops();
    }
  }

  unfilterTag(tag: Tag) {
    const t = this.tagsV.get(tag._id) 
    if (t) {
      t.filtered = false;
      this.filterTagsDrops();
    }
  }

  private previewColor(drop:Drop, startAt:number): string {    
      //if (drop.type === 'SYS') return 'system';
      const color = 
        this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addDay(startAt) }) ? 'day' :
        this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addWeek(startAt) }) ? 'week' :
        this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addMonth(startAt) }) ? 'month' :
        this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addYear(startAt) }) ? 'year' : "";
      
      return color;
  }

  fromTime(stream:HomeStream) {
    // console.log("from time...")
    // from time start at, preview a time
    // start + time 
    this.startAt = stream.startAt;
    this.previewAt = 
      stream.preview === 'day' ? this.dts.addDay(stream.startAt) :
      stream.preview === 'week' ? this.dts.addWeek(stream.startAt) :
      stream.preview === 'month' ? this.dts.addMonth(stream.startAt) :
      stream.preview === 'year' ? this.dts.addYear(stream.startAt) : stream.startAt;
    

    
    for (let d of this.dropsV.values()) {
      d.color = this.previewColor(d, stream.startAt);        
      d.available = (d.date < this.previewAt ) && (!d.available) || !(d.date > this.previewAt) && (d.available);
    }
    this.filterTagsDrops();
  }

  getTags() {
    //console.log(`get tags ${this.tagsV.size}`)
    if (this.tagsV.size != 0)
      this.tags$.next( [...this.tagsV.values()] );
  }

  getDrops() {
    //console.log(`get drops ${this.dropsV.size}`)
    this.drops$.next( [...this.dropsV.values()].filter( d => d.available) .sort( (a,b) => b.date-a.date) );
  }

  getStream(uid: string, tags:string[]):Observable<Drop[]> {
      return this.http.post<Drop[]>(`/api/drops/stream/`, { uid: uid, tags: tags });
  }

  getDrop(did:string):Drop {
    //console.log(`get drop ${did}`)
    let drop = this.dropsV.get(did) || new Drop();
    return new Drop({...drop});
  }

  getTag(tid:string):Tag {
    return this.tagsV.get(tid) || new Tag();
  }

  getSettings() {
    this.settings$.next(this.settingsV);
  }

  getTagIC(id:string) {
    return this.tagsIC.get(id) || { icon: "bookmark", color:"dark" };
  }

  private filterTagsDrops() { 
    // collect filtered tags
    const ftags = [...this.tagsV.values()].filter( t => t.filtered);
    
    // if there are some, apply filters
    if (ftags.length !== 0) {

      // with these filtered tags, calculate the available drops
      const availableDrops:Map<string,Drop> = 
        new Map([...this.dropsV.values()].filter( 
          // for every filter tag, the drop must contain some
          (d:Drop) => d.date < this.previewAt && ftags.every( (fts:Tag) => d.tags.some( (t:Tag) => t._id === fts._id ))
        ).map( d => [d._id,d]) );

      // go through all the available drops, and collect unique tags.
      const availableTags = new Map( [...availableDrops.values()].flatMap( d => d.tags.map( t => [ t._id, t ]) ) );
      
      // update available drops
      for (let d of this.dropsV.values()) d.available = !!availableDrops.get(d._id);

      // update available tags
      for(let t of this.tagsV.values()) t.available = !!availableTags.get(t._id) && !t.filtered;

    } else {
      // no filter, so render all tags available
      for (let t of this.tagsV.values()) {
        t.filtered = false;
        t.available = true;
      }
      // no filter, so render all drops until preview available
      for (let d of this.dropsV.values()) d.available = d.date < this.previewAt; 
      
    }
    this.getTags();
    this.getDrops();    
  }

}