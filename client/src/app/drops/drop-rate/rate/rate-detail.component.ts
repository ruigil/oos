import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { of} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';


import { DateTimeService } from '../../../services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from '../../../model/drop';
import { Tag } from '../../../model/tag';

@Component({
  selector: 'oos-rate-detail',
  templateUrl: './rate-detail.component.html',
  styleUrls: ['./rate-detail.component.scss']
})
export class RateDetailComponent implements OnInit, OnDestroy {

    drop: Drop = new Drop({ rate: { description: "", value: 0 } } );
    btnDisabled: boolean = false;
    dateISO: string = ""; 
    field = new FormControl('', [
        Validators.required,
    ]);    

    recurrences: Array<{ key: string, value: string }>;
    
    constructor(
        private oos: OceanOSService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dts: DateTimeService,
        private snackbar: MatSnackBar) { 

        this.recurrences = dts.getRecurrences();
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id:string = params.get("id") || "0";
                return id === "new" ? of(new Drop({ 
                    title: "",
                    type: "RATE",
                    tags: [ this.oos.getTag('RATE_TYPE') ], 
                    date: this.dts.getTimestamp(new Date()),
                    recurrence: 'none',
                    rate: {
                        description: "",
                        value: 3,
                    } })) : this.oos.getDrop(id);
            })
        ).subscribe( d => {
            this.drop = d;
            this.dateISO = this.dts.getDateISO(this.drop.date); 
        });
    }

    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "rate";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
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

    ngOnDestroy() {
    }

}
