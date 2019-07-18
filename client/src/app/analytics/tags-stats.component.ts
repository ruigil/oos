import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of,  combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { format, parse } from 'date-fns';

import { FireService } from '../services/fire.service';
import { Drop } from '../model/drop';
import { Tag } from '../model/tag';

@Component({
  selector: 'oos-analytics-tags',
  templateUrl: './tags-stats.component.html',
  styleUrls: ['./tags-stats.component.scss']
})
export class TagsStatsComponent implements OnInit {

  view: any[] = [340, 600];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Total';
  showYAxisLabel = false;
  yAxisLabel = 'Day';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

    onSelect(event) {
        console.log(event);
    }
    
    analytics: any;
    data: Array<any> = [];

    constructor(
        private dropsService: FireService, 
        private route: ActivatedRoute, 
        private router: Router) { 

            this.analytics = { tags: [] }
            // TODO: this must be calculated to the correct days in the month
            for (let i=1; i<31; i++) this.data.push( {
                    "name": "" + i,
                    "series": [
                    {
                        "name": "Note",
                        "value": 0
                    },
                    {
                        "name": "Task",
                        "value": 0
                    },
                    {
                        "name": "Transaction",
                        "value": 0
                    }
                    ]
                }
            ); 
    }

    ngOnInit() {
        combineLatest(this.route.paramMap.pipe(
            switchMap( params => {
                let month = Number(params.get("month"));
                let year = Number(params.get("year"));
                return this.dropsService.col$("analytics", ref => ref.where("month","==",month).where("year","==",year) );
            })
        ),
        this.dropsService.col$("tags"))
        .subscribe( ([a,t]) => {
            this.analytics = a[0];
            this.analytics.days.map( d => {
                this.data[d.day-1].series[0].value = d.totals[0];
                this.data[d.day-1].series[1].value = d.totals[1];
                this.data[d.day-1].series[2].value = d.totals[2];
            });
            this.data = this.data.slice(0);
            var colors = {};
            t.map( (t:any) => colors[t.name] = t.color );
            this.analytics.tags = this.analytics.tags.map( tag => ({...tag,color: colors[tag.tag]})).sort( (a,b) => {
                const atot = a.totals.reduce( (acc,v) => acc + v );
                const btot = b.totals.reduce( (acc,v) => acc + v );
                return atot > btot ? -1 : atot < btot ? 1 : 0; 
            });
        });
    }

}
