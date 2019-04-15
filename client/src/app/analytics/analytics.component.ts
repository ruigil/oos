import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { format, parse } from 'date-fns';

import { FireService } from '../services/fire.service';
import { Drop } from '../model/drop';

@Component({
  selector: 'oos-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

    analytics: any[];

    constructor(private dropsService: FireService ) {  }

    ngOnInit() {
        this.dropsService.col$("analytics", ref => ref.orderBy("month","desc")).subscribe( a => this.analytics = a);
    }

}
