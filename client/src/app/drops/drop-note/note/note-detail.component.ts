import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
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
export class NoteDetailComponent implements OnInit, OnDestroy {

    dropObs: Observable<Drop>;
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
        this.dropObs = this.route.paramMap.pipe(
            switchMap( params => {
                let id:string = params.get("id") || "";
                const tag:Tag = this.oos.getTag("NOTE_TYPE");
                return id === "new" ? of(new Drop(
                    { 
                        title: "", 
                        type: "NOTE",
                        recurrence: "none",
                        tags: [ tag ],
                        note: { content: "" },
                        date: Date.now()
                    }) ) : this.oos.getDrop(id);
            })
        );
    }

    ngOnInit() {
        this.dropObs.subscribe( (d:Drop) => {
            this.drop = d;
            this.dateISO = this.dts.getDateISO(d.date);
        });
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

    ngOnDestroy() {
    }

}
