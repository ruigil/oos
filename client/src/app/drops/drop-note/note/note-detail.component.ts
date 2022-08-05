import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { Drop } from '../../../model/drop';
import { Tag } from '../../../model/tag';

@Component({
  selector: 'oos-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements AfterViewInit {

    drop:Drop = new Drop({ note: { content: ""}});
    recurrences: Array<{ key: string, value: string }> = [];
    btnDisabled: boolean = false; 
    dateISO: string = "";
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
        combineLatest([this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {
            let id:string = v[1].get("id") || "new";
            
            this.drop = id === 'new' ? new Drop({ 
                id: "new",
                title: "", 
                type: "GOAL",
                note: { content: "" },
                recurrence: "day",
                tags: [this.oos.getTag("NOTE_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);

        });
    }

    ngAfterViewInit(): void {
        this.oos.getDrops();
    }
    
    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "note";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
        this.drop.title = this.drop.note!.content.split('\n')[0];
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
