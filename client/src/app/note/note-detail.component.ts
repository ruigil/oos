import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { format, parse } from 'date-fns';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDate: string;

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ text: "", tags: ["Note"], date: this.dropsService.date2ts(new Date()) }) ) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {this.drop = d; this.dropDate =  format(d.date.toDate(),"YYYY-MM-DDTHH:mm")} );
    }

    updateNote() {
        let id = this.drop.id;
        this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
        if (delete this.drop.id)
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.router.navigate(["note",id]) },
                (error) => { console.log("error") }
            );
    }

    addNote() {
        this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
        this.dropsService.add("drops",this.drop).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { console.log("error") }
        );
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
