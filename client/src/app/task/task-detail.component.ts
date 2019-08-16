import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../services/fire.service';
import { DateTimeService } from '../services/date-time.service';
import { Drop } from '../model/drop';
import * as moment from "moment";

@Component({
  selector: 'oos-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    recurrences: Array<{ value: string, text: string }>;
    field = new FormControl('', [
        Validators.required,
    ]);    

    constructor(
        private dropsService: FireService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dtService: DateTimeService) { 
        
        this.drop = new Drop({ task: {title: "", date: null, completed: false}, recurrence: 'none'});
        this.recurrences = dtService.getRecurrences();
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "", 
                    type: "TASK",
                    tags: [],
                    date: this.dropsService.date2ts(new Date()),
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
        });
    }

    addTask() {
        this.dropsService.add("drops",{...this.drop, date: this.dropsService.date2ts(this.dtService.getDate(this.dropDateTime))}).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { /*this.presentToast(error);*/ this.router.navigate(["home"]); }
        );
    }
    
    updateTask() {
        let id = this.drop.id;
        if (delete this.drop.id)
            this.drop.date = this.dropsService.date2ts(this.dtService.getDate(this.dropDateTime));
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.router.navigate(["home"]) },
                (error) => { console.log("error") }
            );
    }


    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
