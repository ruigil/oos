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
  selector: 'oos-drop-text-detail',
  templateUrl: './drop-text-detail.component.html',
  styleUrls: ['./drop-text-detail.component.scss']
})
export class DropTextDetailComponent {

    drop:Drop = new Drop({ content: { }});
    recurrences: Array<{ key: string, value: string }> = [];
    btnDisabled: boolean = false; 
    dateISO: string = "";
    tin:any = null;
    field = new FormControl('', [
        Validators.required,
    ]);    
    
    constructor(
        private oos: OceanOSService, 
        private route: ActivatedRoute, 
        private router: Router, 
        private dts: DateTimeService,
        private snackbar: MatSnackBar) { 

        this.recurrences = this.dts.getRecurrences();
        combineLatest([this.oos.streams(),this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {
            let id:string = v[2].get("id") || "new";
            this.drop = id === 'new' ? new Drop({ 
                _id: "new",
                name: "", 
                type: "TEXT_TYPE",
                content: { text: ""},
                recurrence: "none",
                uid: "oos",
                streams: [this.oos.getStreamByType("TEXT_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);

        });
    }

    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "text";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
        this.drop.name = this.drop.name === "" ? this.drop.content.text.split('\n')[0] : this.drop.name;
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
