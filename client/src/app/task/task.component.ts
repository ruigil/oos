import { Component, OnInit } from '@angular/core';
import { FireService } from '../fire.service';
import { Drop } from '../drop';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

    drop: Drop = new Drop();

    constructor(private dropsService: FireService, private route: ActivatedRoute, private router: Router) { 
        this.drop = new Drop({ task: {title: "", completed: false, recurrence: 'week', date: null} });
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => this.drop = d );
    }
    
    deleteTask() {
        this.dropsService.delete("drops/"+ this.drop.id);
        this.router.navigate(["home"]);
    }

}
