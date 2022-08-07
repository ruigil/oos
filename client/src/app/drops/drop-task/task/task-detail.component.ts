import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
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
export class TaskDetailComponent {

    drop: Drop = new Drop({task: { description: "", date: 0, completed: false } });
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
        private snackbar: MatSnackBar) { 
        
        this.recurrences = dts.getRecurrences();
        // TODO: Add completed field to the form and the date
        combineLatest([this.oos.tags(),this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {
            let id:string = v[2].get("id") || "new";
            
            this.drop = id === 'new' ? new Drop({ 
                id: "new",
                title: "", 
                type: "TASK",
                task: { description: "", date: 0, completed: false },
                recurrence: "none",
                tags: [this.oos.getTag("TASK_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

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

}
