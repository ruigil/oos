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
    id: string;

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        console.log("init")
        this.route.paramMap.pipe(
            switchMap( params => {
                this.id = params.get("id");
                return this.dropsService.doc$("drops/"+this.id);
            })
        ).subscribe( d => this.drop = d);
    }

    updateNote() {
        console.log("update "+this.id);
        this.dropsService.update("drops/"+this.id,{ text: this.drop.text }).then( 
            (value) => { console.log("updated! prepare to navigate"); this.router.navigate(["/home"]) },
            (error) => { console.log("error") }
        );
    }

    deleteNote() {
    }

}
