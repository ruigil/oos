import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { DateTimeService } from '../../../services/date-time.service';
import { Drop } from '../../../model/drop';
import { Tag } from '../../../model/tag';
import { OceanOSService } from 'src/app/services/ocean-os.service';

@Component({
  selector: 'oos-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit, OnDestroy {

    drop: Drop = new Drop();
    recurrences: Array<{ key: string, value: string }>;
    dateISO: string = "";
    btnDisabled: boolean = false; 
    field = new FormControl('', [
        Validators.required,
    ]);    

    constructor(
        private oos: OceanOSService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dts: DateTimeService,
        private snackbar: MatSnackBar,
        private location: Location) { 
        
        this.recurrences = dts.getRecurrences();
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id:string = params.get("id") || "0";
                return id === "new" ? of(new Drop({ 
                    title: "", 
                    type: "TASK",
                    tags: [ this.oos.getTag('TASK_TYPE') ],
                    date: this.dts.getTimestamp(new Date()),
                    recurrence: 'none',
                    task: {
                        description: "",
                        date: null,
                        completed: false
                    } })) : this.oos.getDrop(id);
            })
        ).subscribe( d => {
            this.drop = d;
            this.dateISO = this.dts.getDateISO(this.drop.date); 
        });
    }

    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "task";
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
