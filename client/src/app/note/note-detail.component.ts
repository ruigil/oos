import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
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
    tags: Array<string> = [];
    id: string;

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        console.log("init")
        this.route.paramMap.pipe(
            switchMap( params => {
                return this.dropsService.docWithId$("drops/"+params.get("id"));
            })
        ).subscribe( d => this.drop = d );
    }

    updateNote() {
        let id = this.drop.id;
        if (delete this.drop.id)
            this.dropsService.update("drops/"+ id, this.drop )
            .then( 
                (value) => { this.router.navigate(["home"]) },
                (error) => { console.log("error") }
            );
    }

    selectedTags(tags: Array<string>) {
        console.log(" add tags");
        this.drop.tags = tags;
    }

}
