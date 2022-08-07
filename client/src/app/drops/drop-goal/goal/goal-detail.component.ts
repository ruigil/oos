import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { Drop } from '../../../model/drop';
import { Tag } from '../../../model/tag';
import { OceanOSService } from 'src/app/services/ocean-os.service';

@Component({
  selector: 'oos-goal-detail',
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.scss']
})
export class GoalDetailComponent {

    drop: Drop = new Drop({ goal: { content: "", completed: false, totals: [] } });
    dateISO: string = "";
    recurrences: Array<{ key: string, value: string }>;
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
        
        combineLatest([this.oos.tags(),this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {

            let id:string = v[2].get("id") || "new";
            // add a gamification to the goal in teh complete field
            this.drop = id === 'new' ? new Drop({ 
                id: "new",
                title: "", 
                type: "GOAL",
                goal: { content: "", completed: false, totals: [0,0,0,0,0,0,0] }, 
                recurrence: "none",
                tags: [this.oos.getTag("GOAL_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);
            
        });
    }

    dropData(id:string) {
        const op = id ? "updated" : "added";
        const type = "goal";
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
