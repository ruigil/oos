import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { format, parse } from 'date-fns';

@Component({
  selector: 'analytics-page',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {

    analytics: any[];

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { 
    }

    ngOnInit() {
        this.dropsService.col$("analytics").subscribe( a => this.analytics = a);
    }

}
