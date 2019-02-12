import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { LabelsComponent } from '../labels/labels.component';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent implements OnInit {

    drop: Drop = new Drop();
    id: string;
    tags: Array<string> = []

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit() {
        console.log("init")
        this.route.paramMap.pipe(
            switchMap( params => {
                this.id = params.get("id");
                return this.dropsService.doc$("drops/"+this.id);
            })
        ).subscribe( d => {this.drop = d; this.tags = Object.keys(this.drop.tags)} );
    }

    updateNote() {
        Object.keys(this.drop.tags).forEach( k => delete this.drop.tags[k]);
        this.tags.forEach( t => this.drop.tags[t] = true);
        this.dropsService.update("drops/"+this.id,{ text: this.drop.text, tags: this.drop.tags }).then( 
            (value) => { console.log("updated! prepare to navigate"); this.router.navigate(["/home"]) },
            (error) => { console.log("error") }
        );
    }

    selectedLabels(labels: Array<string>) {
        console.log(" add labels");
        this.tags = labels;
    }

}
