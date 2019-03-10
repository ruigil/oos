import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../fire.service';
import { Drop } from '../drop';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

    drop: Drop = new Drop();

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of({ ...this.drop, text: "", tags: ["Note"] }) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => this.drop = d );
    }

    updateNote() {
        let id = this.drop.id;
        if (delete this.drop.id)
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.router.navigate(["note",id]) },
                (error) => { console.log("error") }
            );
    }

    addNote() {
        this.dropsService.add("drops",this.drop).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { console.log("error") }
        );
    }

    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
