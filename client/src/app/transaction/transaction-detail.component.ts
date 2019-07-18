import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { format, parse, setHours, setMinutes } from 'date-fns'; 

import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { Drop } from '../model/drop';
import { Settings } from '../model/settings';

@Component({
  selector: 'oos-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.css']
})
export class TransactionDetailComponent implements OnInit {

    drop: Drop = new Drop();
    settings: Settings = new Settings();
    dropDate: Date;
    dropTime: string = "";

    recurrences: Array<{ value: string, text: string }> = [ 
        { value: "day", text: "Daily"}, 
        { value: "week", text: "Weekly"}, 
        { value: "month", text: "Monthly"}, 
        { value: "year", text: "Yearly"}
    ]

    constructor(
        private dropsService: FireService, 
        private settingsService: SettingsService, 
        private route: ActivatedRoute, 
        private router: Router) { 

        this.drop = new Drop({ transaction: {value: 0.0, type: 'expense', currency: ''}, recurrence: 'none' });
        settingsService.getSettings().subscribe( s => this.settings = s);
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "",
                    type: "TRX",
                    tags: [], 
                    date: this.dropsService.date2ts(new Date()),
                    recurrence: 'none',
                    transaction: {
                        value: 0.0,
                        type: "expense",
                        currency: ''
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {this.drop = d; this.dropDate = d.date.toDate(); this.dropTime = d.date.toDate().getHours() + ":" + d.date.toDate().getMinutes()})
    }

    addTransaction() {
            var time = parse("1970-01-01T"+this.dropTime); 
            this.dropDate = setHours(this.dropDate,time.getHours());
            this.dropDate = setMinutes(this.dropDate,time.getMinutes());
            this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
            this.drop.transaction.value = this.drop.transaction.type === "expense" ? -Math.abs(this.drop.transaction.value) : Math.abs(this.drop.transaction.value);
            this.drop.transaction.currency = this.settings.transaction.currency;
            this.dropsService.add("drops",this.drop).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { console.log("error") }
        );
    }
    
    updateTransaction() {
        let id = this.drop.id;
        if (delete this.drop.id)
            var time = parse("1970-01-01T"+this.dropTime); 
            this.dropDate = setHours(this.dropDate,time.getHours());
            this.dropDate = setMinutes(this.dropDate,time.getMinutes());
            this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
            this.drop.transaction.value = this.drop.transaction.type === "expense" ? -Math.abs(this.drop.transaction.value) : Math.abs(this.drop.transaction.value);
            this.drop.transaction.currency = this.settings.transaction.currency;
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.router.navigate(["home"]) },
                (error) => { console.log("error") }
            );
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
