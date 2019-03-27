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

  view: any[] = [700, 400];

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

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { 
        Object.assign(this, { single })
    }

    ngOnInit() {
        this.route.paramMap.subscribe( params => {
            console.log("month : "+params.get("month"));
            console.log("year : "+params.get("year"));
        });
    }

}
