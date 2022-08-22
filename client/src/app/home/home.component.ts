import { Component } from '@angular/core';
import { Observable, interval, map, distinctUntilChanged } from 'rxjs';
import { DateTimeService } from '../services/date-time.service';
import { OceanOSService } from '../services/ocean-os.service';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Drop } from '../model/drop';
import { Tag } from '../model/tag';
import { HomeStream } from '../model/home-stream';

import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'oos-home',
    templateUrl: 'home.component.html',
    providers: [],
    animations: [
        trigger('openClose', [
            state('fab-buttons-on', style({
                bottom: 90,
                opacity: 1.0,
            })),
            state('fab-buttons-off', style({
                bottom: -300,
                opacity: 0.0
            })),
            transition('fab-buttons-on => fab-buttons-off', [
                animate('0.2s ease-out')
            ]),
            transition('fab-buttons-off => fab-buttons-on', [
                animate('0.3s ease-out')
            ]),
        ]),
    ],
    styleUrls: ['home.component.scss'],
})
export class HomeComponent {

  stream: HomeStream = { startAt: 0, preview: 'day' }
  //separatorKeysCodes: number[] = [ENTER, COMMA];
  availableTags$: Observable<Tag[]>;
  filteredTags$: Observable<Tag[]>;
  streams$:Observable<Tag[]>;
  currentDate$: Observable<string>;

  drops: Observable<Drop[]>;
  tags:Observable<Tag[]>;
  

  constructor(private oos: OceanOSService, private dts: DateTimeService) {
    this.tags = this.oos.tags();
    this.drops = this.oos.drops();

    this.filteredTags$ = this.oos.filteredTags();
    this.availableTags$ = this.oos.availableTags();
    this.streams$ = this.oos.tags().pipe( map( ts => ts.filter( t => t.type === "STREAM" )));

    this.currentDate$ = interval(1000).pipe( 
      map( t => this.dts.isToday(this.stream.startAt) ? 
                this.dts.format(Date.now(),"dd, MMMM @ HH:mm") : 
                this.dts.format(this.stream.startAt, "eeee, dd, MMMM") )
    );
    
    this.oos.settings().pipe( distinctUntilChanged() ).subscribe( u => {
      this.stream.preview = u.settings.home.preview;
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

  filterTag(event:any) {
    this.oos.filterTag(event.option.value);
  }

  unfilterTag(tag:Tag) {
    this.oos.unfilterTag(tag);
  }

}
