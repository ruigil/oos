import { Injectable } from '@angular/core';
import { Subject, Observable, map, combineLatest, ReplaySubject, of } from 'rxjs';
import { Drop } from "../model/drop";
import { Stream } from "../model/stream";
import { DateTimeService } from './date-time.service';

import { HomeStream } from '../model/home-stream';
import { HttpClient } from '@angular/common/http';
import { User } from '../model/user';
import {v4 as uuidv4} from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class OceanOSService {

  private streamsMap: Map<string,Stream> = new Map();
  private streams$: Subject<Stream[]> = new ReplaySubject<Stream[]>(1);

  private dropsMap: Map<string,Drop> = new Map();
  private drops$: Subject<Drop[]> = new ReplaySubject<Drop[]>(1);

  private user: User = new User();
  private user$: Subject<User> = new ReplaySubject<User>(1);

  private previewAt: number = 0;
  private startAt: number = 0;

  private streamStyle: Map<string,{icon:string,color:string}> = new Map([
    ["TEXT_TYPE",{icon:"note",color:"note-icon"}],
    ["RATE_TYPE",{icon:"star",color:"rate-icon"}],
    ["IMAGE_TYPE",{icon:"photo_camera",color:"photo-icon"}],
    ["GOAL_TYPE",{icon:"flag_circle",color:"goal-icon"}],
    ["TASK_TYPE",{icon:"task",color:"task-icon"}],
    ["MONEY_TYPE",{icon:"money",color:"money-icon"}],
    ["SYSTEM_TYPE",{icon:"smart_toy",color:"system-icon"}],    
    ["PUBLIC",{icon:"stream",color:"stream-icon"}],
    ["PERSONAL",{icon:"person_pin_circle",color:"dark"}],
  ]);

  private streamType: Map<string,Stream> = new Map();

  constructor(private dts:DateTimeService, private http:HttpClient) {

    combineLatest([
      this.http.get<Stream[]>(`/api/streams`),
      this.http.get<Drop[]>(`/api/drops`),
      this.http.get<User>(`/api/users/oos`)]).subscribe( ([ss,ds,us]) => {

        this.streamType = new Map(ss.filter( s => s.type.endsWith("TYPE")).map( s => [s.type,s]))

        this.streamsMap = new Map( ss.map( s => new Stream({
          ...s, 
          available: true, 
          filtered: false, 
          selected: false,
          icon: this.streamStyle.get(s.type)?.icon,
          color: this.streamStyle.get(s.type)?.color
        })).map( t => [t._id,t]) );


        this.dropsMap = new Map( ds.map( d => new Drop({
          ...d, 
          available: true,
          streams: d.streams.map( s => new Stream({
            ...s, 
            icon: this.streamStyle.get(s.type)?.icon, 
            color: this.streamStyle.get(s.type)?.color
          }))
        })).map( d => [d._id,d]) );
        
        this.user = us;
        this.user$.next(this.user);
        
        this.fromTime( { preview: this.user.settings.preview, startAt:this.dts.startOfToday() });
      });
  }

  putSettings(settings: User):Promise<Object> {
    return new Promise( (resolve,reject) => {
      this.http.post(`/api/user`, settings).subscribe( u => {
        if (u) {
          this.user = new User({...settings});
          this.user$.next(this.user);
          resolve(u);
        } else reject();
      });
    });
  }

  putStream(stream : Stream ): Promise<Object> {
    stream.uid = this.user._id;
    stream._id = `urn:oos:0x0:${this.user._id}:stream:${stream.name}:${stream.type}`
    return new Promise( (resolve,reject) => {
      this.http.post(`/api/streams`, stream).subscribe( r => {
        if (r) {
          this.streamsMap.set( stream._id, stream);
          this.newStreams();
          resolve(r);
        } else reject();
      });
    });
  }

  putDrop(drop:Drop):Promise<Object> {
    drop.uid = this.user._id;
    drop.color = this.previewColor(drop,this.startAt);
    if (drop._id === 'new') {
      drop._id = `urn:oos:0x0:${this.user._id}:drop:${uuidv4()}`;
    }
    return new Promise( (resolve,reject) => {
      this.http.post(`/api/drops`, drop).subscribe( (r:any) => {
        if (r) {
          //console.log(r);
          this.dropsMap.set(drop._id, drop );
          this.newDrops();
          resolve(r);
        } else reject(false);
      });
    });
  }

  deleteStream(stream : Stream ): Promise<object> {
    return new Promise( (resolve,reject) => {
      this.http.delete(`/api/streams/${stream._id}`).subscribe( r => {
        if (r) {
          this.streamsMap.delete( stream._id );
          for (let d of this.dropsMap.values()) {
            d.streams = d.streams.filter( t => t._id !== stream._id);
          }
          this.newStreams();
          resolve(r);
        } else reject();
      });
    });
  }

  deleteDrop(drop:Drop): Promise<object> {
    return new Promise( (resolve,reject) => {
      this.http.delete(`/api/drops/${drop._id}`).subscribe( r => {
        if (r) {
          this.dropsMap.delete(drop._id);
          this.newDrops();
          resolve(r);
        } else reject();
      });
    });
  }

  streams():Observable<Stream[]> {
    return this.streams$;
  }
  
  drops():Observable<Drop[]> {
    return this.drops$;
  }
  
  settings():Observable<User> {
    return this.user$;
  }

  filteredStreams() {
    return this.streams$.pipe( map( tags => tags.filter( t => t.filtered) ) );
  }

  availableStreams() {
    return this.streams$.pipe( map( tags => tags.filter( t => t.available) ) );
  }

  selectedStreams() {
    return this.streams$.pipe( map( tags => tags.filter( t => t.selected) ) );
  }

  unselectedStreams() {
    return this.streams$.pipe( map( tags => tags.filter(t => !t.selected && !t._id.endsWith("_TYPE") ) ) );
  }

  selectStream(stream: Stream) {
    const t = this.streamsMap.get(stream._id) 
    if (t) {
      t.selected = true;
      this.newStreams();
    }
  }
  unselectStream(stream: Stream) {
    const t = this.streamsMap.get(stream._id) 
    if (t) {
      t.selected = false;
      this.newStreams();
    }
  }

  initStreamSelection(streams: Stream[]) {
    for (let s of this.streamsMap.values()) {
      s.selected = streams.some(st => st._id === s._id)
    }
    this.newStreams();
  }


  filterStream(stream: Stream) {
    const s = this.streamsMap.get(stream._id) 
    if (s) {
      s.filtered = true;
      this.filterStreamDrops();
    }
  }

  unfilterStream(stream: Stream) {
    const s = this.streamsMap.get(stream._id) 
    if (s) {
      s.filtered = false;
      this.filterStreamDrops();
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
    
    
    for (let d of this.dropsMap.values()) {
      d.color = this.previewColor(d, stream.startAt);        
      d.available = (d.date < this.previewAt ) && (!d.available) || !(d.date > this.previewAt) && (d.available);
    }
    this.filterStreamDrops();
  }

  private newStreams() {
    this.streams$.next( [...this.streamsMap.values()] );
  }

  private newDrops() {
    this.drops$.next( [...this.dropsMap.values()].filter( d => d.available) .sort( (a,b) => b.date-a.date) );
  }

  getPublicStream(uid: string, streams:string[]):Observable<Drop[]> {
    return this.http.post<Drop[]>(`/api/users/stream/`, { uid: uid, streams: streams });
  }

  getDrop(did:string):Drop {
    return this.dropsMap.get(did) || new Drop();
  }

  getStreamByType(stype:string):Stream {
    return this.streamType.get(stype) || new Stream();
  }

  getStreamById(userid:string | null, sname:string | null):Observable<Stream> {
    return this.http.get<Stream>(`/api/streams/urn:oos:0x0:${userid}:stream:${sname}:PUBLIC`);
  }

  getStreamStyle(type:string) {
    return this.streamStyle.get(type) || { icon: "bookmark", color: "dark"};
  }

  private filterStreamDrops() { 
    // collect filtered tags
    const fstreams = [...this.streamsMap.values()].filter( s => s.filtered);
    
    // if there are some, apply filters
    if (fstreams.length !== 0) {

      // with these filtered tags, calculate the available drops
      const availableDrops:Map<string,Drop> = 
        new Map([...this.dropsMap.values()].filter( 
          // for every filter tag, the drop must contain some
          (d:Drop) => d.date < this.previewAt && fstreams.every( (fts:Stream) => d.streams.some( (s:Stream) => s._id === fts._id ))
        ).map( d => [d._id,d]) );

      // go through all the available drops, and collect unique streams.
      const availableStreams = new Map( [...availableDrops.values()].flatMap( d => d.streams.map( s => [ s._id, s ]) ) );
      
      // update available drops
      for (let d of this.dropsMap.values()) d.available = !!availableDrops.get(d._id);

      // update available tags
      for(let s of this.streamsMap.values()) s.available = !!availableStreams.get(s._id) && !s.filtered;

    } else {
      // no filter, so render all tags available
      for (let s of this.streamsMap.values()) {
        s.filtered = false;
        s.available = true;
      }
      // no filter, so render all drops until preview available
      for (let d of this.dropsMap.values()) d.available = d.date < this.previewAt; 
      
    }
    this.newStreams();
    this.newDrops();    
  }

}