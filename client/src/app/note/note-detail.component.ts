import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../services/fire.service';
import { DateTimeService } from '../services/date-time.service';
import { Drop } from '../model/drop';

@Component({
  selector: 'oos-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    recurrences: Array<{ value: string, text: string }>;
    
    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router, private dtService: DateTimeService) { 
        this.recurrences = dtService.getRecurrences();
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop(
                    { 
                        text: "", 
                        type: "NOTE",
                        recurrence: "none",
                        tags: [], 
                        date: this.dropsService.date2ts(new Date())
                    }) ) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {
            this.drop = d; 
            this.dropDateTime = this.dtService.getDateTime(d.date.toDate()); 
        });
    }

    updateNote() {
        let id = this.drop.id;
        this.drop.date = this.dropsService.date2ts(this.dtService.getDate(this.dropDateTime));
        if (delete this.drop.id)
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { console.log("OK") },
                (error) => { console.log("error") }
            );
        this.router.navigate(["home"]);
    }

    addNote() {
        this.drop.date = this.dropsService.date2ts(this.dtService.getDate(this.dropDateTime));
        this.dropsService.add("drops",this.drop).then(
            (value) => { console.log("OK") },
            (error) => { console.log("error") }
        );
        this.router.navigate(["home"]);
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
