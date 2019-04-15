import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FireService } from '../services/fire.service';
import { Drop } from '../model/drop';

@Component({
  selector: 'oos-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit {

  drop: Drop = new Drop();

  constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(
        switchMap( params => {
            let id = params.get("id");
            return this.dropsService.docWithId$("drops/"+id);
        })
    ).subscribe( d => this.drop = d );

  }

    deleteNote() {
        this.dropsService.delete("drops/"+ this.drop.id).then( 
            (value) => { this.router.navigate(["home"]) },
            (error) => { console.log("error") }
        );
    }


}
