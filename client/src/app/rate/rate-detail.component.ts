import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { DateTimeService } from '../services/date-time.service';
import { Drop } from '../model/drop';
import * as moment from "moment";

@Component({
  selector: 'app-rate-detail',
  templateUrl: './rate-detail.component.html',
  styleUrls: ['./rate-detail.component.scss']
})
export class RateDetailComponent implements OnInit, OnDestroy {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    btnDisabled: boolean = false; 
    field = new FormControl('', [
        Validators.required,
    ]);    
    subs: Subscription = new Subscription();;

    recurrences: Array<{ value: string, text: string }>;
    
    constructor(
        private dropsService: FireService, 
        private settingsService: SettingsService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dtService: DateTimeService,
        private snackbar: MatSnackBar,
        private location: Location) { 

        this.drop = new Drop({ rate: {text: "", value: 0}, recurrence: 'none' });
        this.recurrences = dtService.getRecurrences();
    }

    ngOnInit() {
        this.subs.add(this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "",
                    type: "RATE",
                    tags: [], 
                    date: this.dtService.date2ts(new Date()),
                    recurrence: 'none',
                    rate: {
                        value: 3,
                        text: "",
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {
            this.drop = d; 
            this.dropDateTime = this.dtService.getDateTime(d.date.toDate())
        }));
    }

    addRate() {
        this.btnDisabled = true;
        this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
        this.dropsService.add("drops",this.drop).then(
            (value) => { this.location.back() },
            (error) => { this.snackbar.open(`Error updating adding [${error}]`); this.btnDisabled = false; }
        );
    }
    
    updateRate() {
        this.btnDisabled = true;
        let id = this.drop.id;
        if (delete this.drop.id) {
            this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.location.back() },
                (error) => { this.snackbar.open(`Error updating rate [${error}]`); this.btnDisabled = false; }
            ); 
        }
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

    goBack() {
        this.location.back();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
