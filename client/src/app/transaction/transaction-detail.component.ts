import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { DateTimeService } from '../services/date-time.service';
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
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    btnDisabled: boolean = false;
    recurrences: any;
    field = new FormControl('', [
        Validators.required,
    ]);    

    constructor(
        private dropsService: FireService, 
        private settingsService: SettingsService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dtService:DateTimeService,
        private snackbar: MatSnackBar,
        private location: Location) { 

        this.drop = new Drop({ transaction: {value: 0.0, type: 'expense', currency: ''}, recurrence: 'none' });
        settingsService.getSettings().subscribe( s => this.settings = s);
        this.recurrences = dtService.getRecurrences();
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "",
                    type: "TRX",
                    tags: [], 
                    date: this.dtService.date2ts(new Date()),
                    recurrence: 'none',
                    transaction: {
                        value: 0.0,
                        type: "expense",
                        currency: ''
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {
            this.drop = d; 
            this.dropDateTime = this.dtService.getDateTime(d.date.toDate()); 
        });
    }

    addTransaction() {
        this.btnDisabled = true;
        this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
        this.drop.transaction.value = this.drop.transaction.type === "expense" ? -Math.abs(this.drop.transaction.value) : Math.abs(this.drop.transaction.value);
        this.drop.transaction.currency = this.settings.transaction.currency;
        this.dropsService.add("drops",this.drop).then(
            (value) => { this.location.back() },
            (error) => { this.snackbar.open(`Error adding transaction [${error}]`); this.btnDisabled = false; }
        );
    }
    
    updateTransaction() {
        this.btnDisabled = true;
        let id = this.drop.id;
        if (delete this.drop.id) {
            this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
            this.drop.transaction.value = this.drop.transaction.type === "expense" ? -Math.abs(this.drop.transaction.value) : Math.abs(this.drop.transaction.value);
            this.drop.transaction.currency = this.settings.transaction.currency;
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.location.back() },
                (error) => { this.snackbar.open(`Error updating transaction [${error}]`); this.btnDisabled = false; }
            ); 
        }
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

    goBack() {
        this.location.back();
    }

}
