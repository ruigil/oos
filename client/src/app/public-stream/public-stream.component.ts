import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, mergeMap, Observable } from 'rxjs';
import { Stream } from '../model/stream';
import { OceanOSService } from '../services/ocean-os.service';


@Component({
  selector: 'oos-stream',
  templateUrl: './public-stream.component.html',
  styleUrls: ['./public-stream.component.scss']
})
export class PublicStreamComponent {
  stream$: Observable<Stream>;

  constructor(private oos: OceanOSService, private route: ActivatedRoute, ) { 
    this.stream$ = this.route.paramMap.pipe( mergeMap( v => this.oos.getStreamById(v.get('uid'),v.get("name")) ));
  }


}
