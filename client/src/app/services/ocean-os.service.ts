import { Injectable } from '@angular/core';
import { Subject, Observable, tap, range, timeInterval, filter, map } from 'rxjs';
import { Drop } from "../model/drop";
import { Tag } from "../model/tag";
import { DateTimeService } from './date-time.service';
import { subHours, addHours, startOfDay, endOfToday, endOfMonth, endOfWeek, endOfYear, endOfDay } from 'date-fns';
import { Settings } from '../model/settings';
import { Stream } from '../model/stream';


const TAGS = [
  new Tag({ id:"NOTE_TYPE", name:"NOTE", count: 0 , color: "note-icon", icon: 'note' }),
  new Tag({ id:"RATE_TYPE", name:"RATE", count: 0 , color: "rate-icon", icon: 'star_rate'  }),
  new Tag({ id:"TASK_TYPE", name:"TASK", count: 0 , color: "task-icon", icon: 'folder' }),
  new Tag({ id:"GOAL_TYPE", name:"GOAL", count: 0 , color: "goal-icon", icon: 'center_focus_strong' }),
  new Tag({ id:"MONEY_TYPE", name:"MONEY", count: 0 , color: "money-icon", icon: 'monetization_on' }),
  new Tag({ id:"SYS_TYPE", name:"SYSTEM", count: 0 , color: "system-icon", icon: 'brightness_7'}),
  new Tag({ id: "HELLO", name:"HELLO", count: 0, color: "red", icon: 'bookmark'}),
  new Tag({ id: "YES", name:"YES", count: 0, color: "blue", icon: 'bookmark'}),
  new Tag({ id: "BYE", name:"BYE", count: 0, color: "green", icon: 'bookmark'}),
  new Tag({ id: "OOH", name:"OHH", count: 0, color: "yellow", icon: 'bookmark'})
]
@Injectable({
  providedIn: 'root'
})
export class OceanOSService {

  tagsV: Map<string,Tag> = new Map();
  tags$: Subject<Tag[]> = new Subject<Tag[]>();

  dropsV: Map<string,Drop> = new Map();
  drops$: Subject<Drop[]> = new Subject<Drop[]>();

  settingsV: Settings = new Settings({ transaction: { currency: "CHF"}, home: { preview: 'day'}, system: { day: true } } );
  settings$: Subject<Settings> = new Subject<Settings>();

  previewAt: number = 0;

  constructor(private dts:DateTimeService) {

    this.tagsV = new Map( TAGS.map( t => [t.id,t] ) );

    for (let i=0; i<1000; i++) {

      let d:any = 
        i%6 == 1 ? { money: { value: 10.3, type: "expense", currency: "CHF" } } :
        i%6 == 2 ? { task: { description: "Task To Do Something", date: 0, completed: false } } :
        i%6 == 3 ? { system: { content: "SYSTEM"  } } :
        i%6 == 4 ? { rate: { description: "GOOD thing to Rate", value:  3 } } :
        i%6 == 5 ? { goal: { content: "__This is a Goal__", system: false, completed: false, totals: [2,3,4] } } :
        { note: { content: "__This is a text note__" } };

      let dtype =   
        i%6 == 1 ? "MONEY" :
        i%6 == 2 ? "TASK" :
        i%6 == 3 ? "SYS" :
        i%6 == 4 ? "RATE" :
        i%6 == 5 ? "GOAL" : "NOTE";

      let dd = {
        id: this.generateID(),
        type: dtype,
        title: dtype === 'TASK'? `Do Something`: dtype === 'RATE' ? `GOOD` : `This is a ${dtype} drop`,
        recurrence: "day",
        tags: 
          dtype === 'NOTE' ? [ this.tagsV.get("NOTE_TYPE"), this.tagsV.get("HELLO") ] :
          dtype === 'RATE' ? [ this.tagsV.get("RATE_TYPE"), this.tagsV.get("BYE") ] :
          dtype === 'TASK' ? [ this.tagsV.get("TASK_TYPE"), this.tagsV.get("HELLO") ] :
          dtype === 'GOAL' ? [ this.tagsV.get("GOAL_TYPE"), this.tagsV.get("BYE") ] :
          dtype === 'MONEY' ? [ this.tagsV.get("MONEY_TYPE"), this.tagsV.get("HELLO") ] : []
        ,
        date: subHours(endOfYear(Date.now()), i*12 ),
        deleted: false,
        ...d
      };
      let drop = new Drop(dd);
      this.dropsV.set(drop.id, drop);
    }

  }


  putTag(tag : Tag ): Promise<boolean> {
    this.tagsV.set(tag.id, tag);
    this.getTags();
    return Promise.resolve(true);
  }

  putDrop(drop:Drop):Promise<boolean> {
    if (!drop.id) {
      drop.id = this.generateID();
    }
    this.dropsV.set(drop.id, drop );
    this.getDrops();
    return Promise.resolve(false);
  }

  deleteTag(tag : Tag ): Promise<boolean> {
    this.tagsV.delete( tag.id );
    this.getTags();
    return Promise.resolve(true);
  }

  deleteDrop(drop:Drop): Promise<boolean> {
    this.dropsV.delete(drop.id);
    this.getDrops();
    return Promise.resolve(true);
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
    this.tagsV.get(tag.id)!.selected = true;
    this.getTags();
  }

  unselectTag(tag: Tag) {
    this.tagsV.get(tag.id)!.selected = false;
    this.getTags();
  }

  filterTag(tag: Tag) {
    this.tagsV.get(tag.id)!.filtered = true;
    this.filterTagsDrops();
  }

  unfilterTag(tag: Tag) {
    this.tagsV.get(tag.id)!.filtered = false;
    this.filterTagsDrops();
  }

  clearTagSelection() {
    for (let t of this.tagsV.values()) t.selected = false;
    this.getTags();
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
    this.tags$.next( [...this.tagsV.values()] );
  }

  getDrops() {
    this.drops$.next( [...this.dropsV.values()].filter( d => d.available) .sort( (a,b) => b.date-a.date) );
  }

  getDrop(did:string):Drop {
    return this.dropsV.get(did) || new Drop();
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