import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { format, parse, setHours, setMinutes } from 'date-fns';

import { FireService } from '../services/fire.service';
import { Drop } from '../model/drop';

@Component({
  selector: 'oos-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDateTime: { date: Date, time: string } = { date: new Date(), time: "00:00" };
    recurrences: Array<{ value: string, text: string }> = [ 
        { value: "day", text: "Daily"}, 
        { value: "week", text: "Weekly"}, 
        { value: "month", text: "Monthly"}, 
        { value: "year", text: "Yearly"}
    ]

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { 
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
            this.dropDateTime = { date:d.date.toDate(), time:d.date.toDate().getHours()+":"+d.date.toDate().getMinutes() }; 
        });
    }

    private getDate() {
        var time = parse("1970-01-01T"+this.dropDateTime.time); 
        this.dropDateTime.date = setHours(this.dropDateTime.date,time.getHours());
        this.dropDateTime.date = setMinutes(this.dropDateTime.date,time.getMinutes());
        return this.dropDateTime.date;
    }

    updateNote() {
        let id = this.drop.id;
        this.drop.date = this.dropsService.date2ts(parse(this.getDate()));
        if (delete this.drop.id)
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { console.log("OK") },
                (error) => { console.log("error") }
            );
        this.router.navigate(["home"]);
    }

    addNote() {
        this.drop.date = this.dropsService.date2ts(parse(this.getDate()));
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
