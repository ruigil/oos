import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


import { DateTimeService } from '../../../services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from '../../../model/drop';
import { Stream } from '../../../model/stream';

@Component({
  selector: 'oos-rate-detail',
  templateUrl: './drop-rate-detail.component.html',
  styleUrls: ['./drop-rate-detail.component.scss']
})
export class DropRateDetailComponent {

    drop: Drop = new Drop({ content: { value: 0 } } );
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
        combineLatest([this.oos.streams(),this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {

            let id:string = v[2].get("id") || "new";
            
            this.drop = id === 'new' ? new Drop({ 
                _id: "new",
                name: "", 
                type: "RATE_TYPE",
                content: { text: "", value: 0 },
                recurrence: "none",
                streams: [this.oos.getStreamByType("RATE_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);
            
        });
    }

    dropData(id:string) {
        const op = id !== 'new' ? "updated" :"added";
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

    selectedStreams(streams: Array<Stream>) {
        this.drop.streams = streams;
    }

}
