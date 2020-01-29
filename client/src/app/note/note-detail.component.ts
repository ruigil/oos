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

@Component({
  selector: 'oos-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit, OnDestroy {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    recurrences: Array<{ value: string, text: string }>;
    btnDisabled: boolean = false; 
    subs: Subscription = new Subscription();
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
            
        this.recurrences = dtService.getRecurrences();
    }

    ngOnInit() {
        this.subs.add(this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop(
                    { 
                        text: "", 
                        type: "NOTE",
                        recurrence: "none",
                        tags: [], 
                        date: this.dtService.date2ts(new Date())
                    }) ) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {
            this.drop = d; 
            this.dropDateTime = this.dtService.getDateTime(d.date.toDate()); 
        }));
    }

    updateNote() {
        this.btnDisabled = true;
        let id = this.drop.id;
        if (delete this.drop.id) {
            this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.location.back() },
                (error) => { this.snackbar.open(`Error updating note [${error}]`); this.btnDisabled = false; }
            );
        }
    }

    addNote() {
        this.btnDisabled = true;
        this.drop.date = this.dtService.date2ts(this.dtService.getDate(this.dropDateTime));
        this.dropsService.add("drops",this.drop).then(
            (value) => { this.router.navigate(["/home"]) },
            (error) => { this.snackbar.open(`Error updating note [${error}]`); this.btnDisabled = false; }
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
