import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, mergeMap, Observable, switchMap, take } from 'rxjs';
import { Drop } from '../model/drop';
import { OceanOSService } from '../services/ocean-os.service';

@Component({
  selector: 'oos-stream',
  templateUrl: './stream.component.html',
  styleUrls: ['./stream.component.scss']
})
export class StreamComponent {
  drops$: Observable<Drop[]>;

  constructor(private oos: OceanOSService, private route: ActivatedRoute, ) { 

    this.drops$ = this.route.paramMap.pipe( mergeMap( v => this.oos.getStream( v.get("uid"), `${v.get("id")}_STREAM` ) ) );
  }


}
