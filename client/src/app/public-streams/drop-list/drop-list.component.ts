import { AfterViewInit, Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, Observable, of, switchMap, take } from 'rxjs';
import { Drop } from '../../model/drop';
import { Stream } from '../../model/stream';
import { OceanOSService } from '../../services/ocean-os.service';

@Component({
  selector: 'drop-list',
  templateUrl: './drop-list.component.html',
  styleUrls: ['./drop-list.component.scss']
})
export class DropListComponent implements AfterViewInit {
  @Input()
  stream: Stream = new Stream();

  drops$: Observable<Drop[]> = of([]);
  streamsSelected: Map<string,Stream> = new Map();
  streamsAvailable: Map<string,Stream> = new Map();

  constructor(private oos: OceanOSService ) { 
  }

  ngAfterViewInit(){
    this.drops$ = this.getStream(); 
  }

  unselectStream(stream:Stream) {
    if (this.streamsSelected.has(stream._id)) {
      this.streamsSelected.delete(stream._id);
    }
    this.drops$ = this.getStream();
  }

  selectStream(event: any) {
    const tag = event.option.value;
    if (!this.streamsSelected.has(tag._id)) {
      this.streamsSelected.set(tag._id, tag);
    }
    this.drops$ = this.getStream();
  }

  private getStream() {
    return this.oos.getPublicStream( this.stream.uid, [...this.streamsSelected.keys(),this.stream._id] ).pipe( map( ds => {
      
      const dt = ds.map( d => new Drop({ 
        ...d, 
        streams: d.streams.filter(s => s.type != "PUBLIC").map( t => new Stream({
          ...t, 
          icon: this.oos.getStreamStyle(t.type)?.icon, 
          color:  this.oos.getStreamStyle(t.type)?.color 
        }))
      }));

      this.streamsAvailable.clear();
      
      dt.forEach( d => d.streams.forEach( s => { 
        if ((s.type !== 'PUBLIC') && (!this.streamsSelected.get(s._id))) this.streamsAvailable.set(s._id, s) 
      }));

      return dt;
    }));
  }

}
