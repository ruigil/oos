import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Settings } from '../../../model/settings';
import { Tag } from '../../../model/tag';
import { Drop } from '../../../model/drop';

@Component({
  selector: 'oos-money-detail',
  templateUrl: './money-detail.component.html',
  styleUrls: ['./money-detail.component.scss']
})
export class MoneyDetailComponent implements OnInit, AfterViewInit {

    drop: Drop = new Drop();
    settings: Settings = new Settings();
    btnDisabled: boolean = false;
    dateISO:string = "";
    recurrences: Array<{key:string, value:string}> = [];
    field = new FormControl('', [
        Validators.required,
    ]);    

    constructor(
        private oos: OceanOSService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dts: DateTimeService,
        private snackbar: MatSnackBar) { 

        this.oos.settings().pipe(distinctUntilChanged()).subscribe( s =>  this.settings = s );
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id:string = params.get("id") || "";
                return id === "new" ? of(new Drop({ 
                    title: "",
                    type: "MONEY",
                    tags: [ this.oos.getTag('MONEY_TYPE') ], 
                    date: Date.now(),
                    recurrence: 'none',
                    money: {
                        value: 0.0,
                        type: "expense",
                        currency: ''
                    } })) : this.oos.getDrop(id);
            })
        ).subscribe( d => {
            console.log(d);
            this.drop = d; 
            this.dateISO = this.dts.getDateISO(this.drop.date);
        });
    }

    ngAfterViewInit() {
        this.oos.getSettings();
        this.recurrences = this.dts.getRecurrences();
    }

    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "transaction";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
        this.drop.money!.currency = this.settings.transaction.currency;
        this.oos.putDrop(this.drop).then(
            (value) => {
                this.snackbar
                .open(`The ${type} was successfully ${op}`,"OK")
                .afterDismissed().subscribe( s => this.router.navigate(["home"]) );
            },
            (error) => { 
                this.snackbar
                .open(`The ${type} was NOT ${op}. Error [${error}]`,'OK')
                .afterDismissed().subscribe( s => this.btnDisabled = false );
            }
        );
    }

    selectedTags(tags: Array<Tag>) {
        this.drop.tags = tags;
    }

}
