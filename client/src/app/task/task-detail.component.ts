import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Location } from '@angular/common';

import { FireService } from '../services/fire.service';
import { DateTimeService } from '../services/date-time.service';
import { Drop } from '../model/drop';
import * as moment from "moment";

@Component({
  selector: 'oos-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit, OnDestroy {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    recurrences: Array<{ value: string, text: string }>;
    btnDisabled: boolean = false; 
    subs:Subscription = new Subscription();
    field = new FormControl('', [
        Validators.required,
    ]);    

    constructor(
        private dropsService: FireService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dtService: DateTimeService,
        private snackbar: MatSnackBar,
        private location: Location) { 
        
        this.drop = new Drop({ task: {title: "", date: null, completed: false}, recurrence: 'none'});
        this.recurrences = dtService.getRecurrences();
    }

    ngOnInit() {
        this.subs.add(this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "", 
                    type: "TASK",
                    tags: [],
                    date: this.dtService.date2ts(new Date()),
                    recurrence: 'none',
                    task: {
                        title: "",
                        date: null,
                        completed: false
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {
            this.drop = d; 
            this.dropDateTime = this.dtService.getDateTime(d.date.toDate()); 
        }));
    }

    addTask() {
        this.btnDisabled = true;
        this.dropsService.add("drops",{...this.drop, date: this.dtService.date2ts(this.dtService.getDate(this.dropDateTime))}).then(
            (value) => { this.location.back() },
            (error) => { this.snackbar.open(`Error adding task [${error}]`); this.btnDisabled = false; }
        );
    }
    
    updateTask() {
        this.btnDisabled = true;
        let id = this.drop.id;
        if (delete this.drop.id)
            this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.location.back() },
                (error) => { this.snackbar.open(`Error updating task [${error}]`); this.btnDisabled = false; }
            );
    }


    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

    goBack() {
        this.location.back();
    }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
