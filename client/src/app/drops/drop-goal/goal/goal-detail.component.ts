import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { Drop, goal } from '../../../model/drop';
import { Tag } from '../../../model/tag';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { G } from '@angular/cdk/keycodes';

@Component({
  selector: 'oos-goal-detail',
  templateUrl: './goal-detail.component.html',
  styleUrls: ['./goal-detail.component.scss']
})
export class GoalDetailComponent {

    drop: Drop = new Drop({ content: { completed: false, tags: [] } });
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
                _id: "new",
                title: "",
                text: "", 
                type: "GOAL",
                content: { completed: false, tags: [] }, 
                recurrence: "none",
                tags: [this.oos.getTag("GOAL_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);
            
        });
    }
        /*
         0 -> totals tasks, 
         1 -> total task completed
         2 -> total expenses
         3 -> total incomes
         4 -> total rates
         5 -> total rate values
         6 -> total notes
        */

    dropData(id:string) {
        const op = id ? "updated" : "added";
        const type = "goal";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
        const gtags = new Map<string,Array<number>>( this.drop.content!.tags.map( (t:{id: string, totals: Array<number>}) => [t.id,t.totals]) );
        this.drop.content!.tags = 
            this.drop.tags
            .filter( t => !t._id.endsWith('_TYPE'))
            .map( t =>  (gtags.get(t._id)) ? { id: t._id, totals: gtags.get(t._id) }: { id: t._id, totals: [0,0,0,0,0,0,0]} );
        
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
