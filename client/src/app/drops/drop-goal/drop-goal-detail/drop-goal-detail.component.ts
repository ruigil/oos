import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { Drop } from '../../../model/drop';
import { Stream } from '../../../model/stream';
import { OceanOSService } from 'src/app/services/ocean-os.service';
import { G } from '@angular/cdk/keycodes';

@Component({
  selector: 'oos-drop-goal-detail',
  templateUrl: './drop-goal-detail.component.html',
  styleUrls: ['./drop-goal-detail.component.scss']
})
export class DropGoalDetailComponent {

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
        
        combineLatest([this.oos.streams(),this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {

            let id:string = v[2].get("id") || "new";
            // add a gamification to the goal in teh complete field
            this.drop = id === 'new' ? new Drop({ 
                _id: "new",
                name: "",
                type: "GOAL_TYPE",
                content: { text: "", completed: false, streams: [] }, 
                recurrence: "none",
                streams: [this.oos.getStreamByType("GOAL_TYPE")],
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
        this.drop.content.createdAt = Date.now();
        const gstreams = new Map<string,Array<number>>( this.drop.content!.streams.map( (t:{id: string, totals: Array<number>}) => [t.id,t.totals]) );
        this.drop.content!.streams = 
            this.drop.streams
            .filter( s => !s.type.endsWith('_TYPE'))
            .map( s =>  (gstreams.get(s._id)) ? { id: s._id, totals: gstreams.get(s._id) }: { id: s._id, totals: [0,0,0,0,0,0,0,0]} );
        
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
