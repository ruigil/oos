import { Component } from '@angular/core';
import { Observable, interval, map, distinctUntilChanged } from 'rxjs';
import { DateTimeService } from '../services/date-time.service';
import { OceanOSService } from '../services/ocean-os.service';

import { Stream } from '../model/stream';
import { HomeStream, IDrop } from '../model/oos-types';

@Component({
    selector: 'oos-home',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss'],
})
export class HomeComponent {

  stream: HomeStream = { startAt: 0, preview: 'day' }
  availableStreams$: Observable<Stream[]>;
  filteredStreams$: Observable<Stream[]>;
  publicStreams$:Observable<Stream[]>;
  currentDate$: Observable<string>;
  drops: Observable<IDrop[]>;
  tags:Observable<Stream[]>;
  
  constructor(private oos: OceanOSService, private dts: DateTimeService) {
    this.tags = this.oos.streams();
    this.drops = this.oos.drops();

    this.filteredStreams$ = this.oos.filteredStreams();
    this.availableStreams$ = this.oos.availableStreams();
    this.publicStreams$ = this.oos.streams().pipe( map( ts => ts.filter( t => t.type === "PUBLIC" )));

    this.currentDate$ = interval(1000).pipe( 
      map( t => this.dts.isToday(this.stream.startAt) ? 
                this.dts.format(Date.now(),"dd, MMMM @ HH:mm") : 
                this.dts.format(this.stream.startAt, "eeee, dd, MMMM") )
    );
    
    this.oos.settings().pipe( distinctUntilChanged() ).subscribe( u => {
      this.stream.preview = u.settings.preview;
      this.stream.startAt = this.dts.startOfToday();
    });

  }

  setStartAt(event:any) {
      this.stream.startAt = event.value.getTime();
      this.oos.fromTime(this.stream);
  }

  futurePreview(event:any) {
    this.stream.preview = event.value;
    this.oos.fromTime(this.stream);
  }

  filterStream(event:any) {
    this.oos.filterStream(event.option.value);
  }

  unfilterStream(stream:Stream) {
    this.oos.unfilterStream(stream);
  }

}
