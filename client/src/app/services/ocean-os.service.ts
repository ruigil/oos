import { Injectable } from '@angular/core';
import { Subject, Observable, tap, range, timeInterval, filter, map, firstValueFrom, of, combineLatest, ReplaySubject } from 'rxjs';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";
import { DateTimeService } from './date-time.service';
import { subHours, addHours, startOfDay, endOfToday, endOfMonth, endOfWeek, endOfYear, endOfDay } from 'date-fns';
import { Settings } from '../model/settings';
import { Stream } from '../model/stream';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OceanOSService {

  private tagsV: Map<string,Tag> = new Map();
  private tags$: Subject<Tag[]> = new ReplaySubject<Tag[]>(1);

  private dropsV: Map<string,Drop> = new Map();
  private drops$: Subject<Drop[]> = new ReplaySubject<Drop[]>(1);

  private settingsV: Settings = new Settings({ transaction: { currency: "CHF"}, home: { preview: 'day'}, system: { day: true } } );
  private settings$: Subject<Settings> = new ReplaySubject<Settings>(1);

  private previewAt: number = 0;
  private apiUrl: string = environment.apiUrl;

  constructor(private dts:DateTimeService, private http:HttpClient) {

    // TODO: implement remote settings
    combineLatest([
      this.http.get<Tag[]>(`${this.apiUrl}/api/tags`),
      this.http.get<Drop[]>(`${this.apiUrl}/api/drops`)])
      .subscribe( ([ts,ds]) => {
        this.tagsV = new Map( ts.map( t => new Tag({...t, available: true, filtered: false, selected: false})).map( t => [t.id,t]) );
        this.dropsV = new Map( ds.map( d => new Drop({...d, available: true})).map( d => [d.id,d]) );
        this.fromTime( { preview: 'day', startAt:this.dts.startOfToday() });
      });
      this.getSettings();
  }


  putTag(tag : Tag ): Promise<Object> {
    return new Promise( (resolve,reject) => {
      this.http.post(`${this.apiUrl}/api/tags`, tag).subscribe( r => {
        if (r) {
          this.tagsV.set( tag.id, tag );
          this.getTags();
          resolve(r);
        } else reject();
      });
    });
  }

  putDrop(drop:Drop):Promise<object> {
    if (drop.id === 'new') {
      drop.id = this.generateID();
    }
    return new Promise( (resolve,reject) => {
      this.http.post(`${this.apiUrl}/api/drops`, drop).subscribe( r => {
        if (r) {
          this.dropsV.set(drop.id, drop );
          this.getDrops();
          resolve(r);
        } else reject();
      });
    });
  }

  deleteTag(tag : Tag ): Promise<object> {
    return new Promise( (resolve,reject) => {
      this.http.delete(`${this.apiUrl}/api/tags/${tag.id}`).subscribe( r => {
        if (r) {
          this.tagsV.delete( tag.id );
          for (let d of this.dropsV.values()) {
            d.tags = d.tags.filter( t => t.id !== tag.id);
          }
          this.getTags();
          resolve(r);
        } else reject();
      });
    });
  }

  deleteDrop(drop:Drop): Promise<object> {
    return new Promise( (resolve,reject) => {
      this.http.delete(`${this.apiUrl}/api/drops/${drop.id}`).subscribe( r => {
        if (r) {
          this.dropsV.delete(drop.id);
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
    return this.tags$.pipe( map( tags => tags.filter(t => !t.selected && !t.id.endsWith("_TYPE") ) ) );
  }

  settings():Observable<Settings> {
    return this.settings$;
  }

  selectTag(tag: Tag) {
    const t = this.tagsV.get(tag.id) 
    if (t) {
      t.selected = true;
      this.getTags();
    }
  }
  unselectTag(tag: Tag) {
    const t = this.tagsV.get(tag.id) 
    if (t) {
      t.selected = false;
      this.getTags();
    }
  }

  initTagSelection(tags: Tag[]) {
    for (let t of this.tagsV.values()) {
      t.selected = tags.some(st => st.id === t.id)
    }
    this.getTags();
  }


  filterTag(tag: Tag) {
    const t = this.tagsV.get(tag.id) 
    if (t) {
      t.filtered = true;
      this.filterTagsDrops();
    }
  }

  unfilterTag(tag: Tag) {
    const t = this.tagsV.get(tag.id) 
    if (t) {
      t.filtered = false;
      this.filterTagsDrops();
    }
  }


  fromTime(stream:Stream) {
    // from time start at, preview a time
    // start + time 
    this.previewAt = 
      stream.preview === 'day' ? this.dts.addDay(stream.startAt) :
      stream.preview === 'week' ? this.dts.addWeek(stream.startAt) :
      stream.preview === 'month' ? this.dts.addMonth(stream.startAt) :
      stream.preview === 'year' ? this.dts.addYear(stream.startAt) : stream.startAt;
    
    const previewColor = (drop:Drop, startAt:number): string  => {    
        //if (drop.type === 'SYS') return 'system';
        const color = 
          this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addDay(startAt) }) ? 'day' :
          this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addWeek(startAt) }) ? 'week' :
          this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addMonth(startAt) }) ? 'month' :
          this.dts.isWithin(drop.date,{ start: startAt, end: this.dts.addYear(startAt) }) ? 'year' : "";
        
        return color;
    }
    
    for (let d of this.dropsV.values()) {
      d.color = previewColor(d, stream.startAt);        
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

  saveSettings(settings: Settings):Promise<boolean> {
    this.settingsV = settings;
    this.settings$.next(this.settingsV);
    return Promise.resolve(true);
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
          (d:Drop) => d.date < this.previewAt && ftags.every( (fts:Tag) => d.tags.some( (t:Tag) => t.id === fts.id ))
        ).map( d => [d.id,d]) );

      // go through all the available drops, and collect unique tags.
      const availableTags = new Map( [...availableDrops.values()].flatMap( d => d.tags.map( t => [ t.id, t ]) ) );
      
      // update available drops
      for (let d of this.dropsV.values()) d.available = !!availableDrops.get(d.id);

      // update available tags
      for(let t of this.tagsV.values()) t.available = !!availableTags.get(t.id) && !t.filtered;

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

  private generateID(): string {
    return Date.now().toString(36).concat(Math.random().toString(36).substring(2,8));
  }

}