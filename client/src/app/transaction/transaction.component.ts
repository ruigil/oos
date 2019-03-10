import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.css']
})
export class TransactionComponent implements OnInit {

  drop: Drop = new Drop();

  constructor(private dropsService: FireService, private route: ActivatedRoute) { 
      this.drop.transaction = { value: 0.0, type: 'expense', recurrence: 'week'};
  }

  ngOnInit() {
    this.route.paramMap.pipe(
        switchMap( params => {
            let id = params.get("id");
            return this.dropsService.docWithId$("drops/"+id);
        })
    ).subscribe( d => this.drop = d );

  }

}
