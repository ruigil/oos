import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SettingsService } from '../services/settings.service';
import { FireService } from '../services/fire.service';
import { DateTimeService } from '../services/date-time.service';
import { Drop } from '../model/drop';
import * as moment from "moment";

@Component({
  selector: 'app-rate-detail',
  templateUrl: './rate-detail.component.html',
  styleUrls: ['./rate-detail.component.scss']
})
export class RateDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    field = new FormControl('', [
        Validators.required,
    ]);    

    recurrences: Array<{ value: string, text: string }>;
    
    constructor(
        private dropsService: FireService, 
        private settingsService: SettingsService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dtService:DateTimeService) { 

        this.drop = new Drop({ rate: {text: "", value: 0}, recurrence: 'none' });
        this.recurrences = dtService.getRecurrences();

    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "",
                    type: "RATE",
                    tags: [], 
                    date: this.dropsService.date2ts(new Date()),
                    recurrence: 'none',
                    rate: {
                        value: 3,
                        text: "",
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {
            this.drop = d; 
            this.dropDateTime = this.dtService.getDateTime(d.date.toDate())
        });
    }

    addRate() {
            this.drop.date = this.dropsService.date2ts(this.dtService.getDate(this.dropDateTime));
            this.dropsService.add("drops",this.drop).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { console.log("error") }
        );
    }
    
    updateRate() {
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
