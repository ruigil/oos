import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { format, parse } from 'date-fns';

import { FireService } from '../fire.service';
import { Drop } from '../drop';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDate: string = "";

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { 
        this.drop = new Drop({ transaction: {value: 0.0, type: 'expense'}, recurrence: 'none' });
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "", 
                    tags: ["Transaction"], 
                    date: this.dropsService.date2ts(new Date()),
                    recurrence: 'none',
                    transaction: {
                        value: 0.0,
                        type: "expense"
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {this.drop = d; this.dropDate =  format(d.date.toDate(),"YYYY-MM-DDTHH:mm")})
    }

    addTransaction() {
        this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
        this.drop.transaction.value = this.drop.transaction.type === "expense" ? -Math.abs(this.drop.transaction.value) : Math.abs(this.drop.transaction.value);
        this.dropsService.add("drops",this.drop).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { console.log("error") }
        );
    }
    
    updateTransaction() {
        let id = this.drop.id;
        if (delete this.drop.id)
            this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
            this.drop.transaction.value = this.drop.transaction.type === "expense" ? -Math.abs(this.drop.transaction.value) : Math.abs(this.drop.transaction.value);
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.router.navigate(["transaction",id]) },
                (error) => { console.log("error") }
            );
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
