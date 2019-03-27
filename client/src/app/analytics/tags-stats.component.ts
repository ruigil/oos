import { Component, OnInit, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { format, parse } from 'date-fns';


export var single = [
  {
    "name": "2, March",
    "series": [
      {
        "name": "Note",
        "value": 20
      },
      {
        "name": "Transaction",
        "value": 2
      },
      {
        "name": "Task",
        "value": 22
      }
    ]
  },
  {
    "name": "3, March",
    "series": [
      {
        "name": "Note",
        "value": 12
      },
      {
        "name": "Transaction",
        "value": 7
      },
      {
        "name": "Task",
        "value": 2
      }
    ]
  },
  {
    "name": "4, March",
    "series": [
      {
        "name": "Note",
        "value": 12
      },
      {
        "name": "Transaction",
        "value": 7
      },
      {
        "name": "Task",
        "value": 2
      }
    ]
  }
]

@Component({
  selector: 'analytics-page',
  templateUrl: './tags-stats.component.html',
  styleUrls: ['./tags-stats.component.scss']
})
export class TagsStatsComponent implements OnInit {
  single: any[];
  multi: any[];

  view: any[] = [850, 400];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Day';
  showYAxisLabel = true;
  yAxisLabel = 'Total Drops';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  onSelect(event) {
    console.log(event);
  }
  analytics: any;
    data: Array<any> = [];

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { 
            this.analytics = { tags: [] }
            for (let i=1; i<31; i++) this.data.push(
                {
                    "name": "" + i,
                    "series": [
                    {
                        "name": "Note",
                        "value": 0
                    },
                    {
                        "name": "Transaction",
                        "value": 0
                    },
                    {
                        "name": "Task",
                        "value": 0
                    }
                    ]
                }
            );
    }

    ngOnInit() {
        this.route.paramMap.subscribe( params => {
        this.route.paramMap.pipe(
            switchMap( params => {
                let month = Number(params.get("month"));
                let year = Number(params.get("year"));
                return this.dropsService.col$("analytics", ref => ref.where("month","==",month).where("year","==",year) );
            })
        ).subscribe( a => {
            this.analytics = a[0];
            this.analytics.days.map( d => {
                this.data[d.day-1].series[0].value = d.notes;
                this.data[d.day-1].series[1].value = d.transactions;
                this.data[d.day-1].series[2].value = d.tasks;
            });
            this.data = this.data.slice(0);
        });
        });
    }

}
