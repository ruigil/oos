import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { format, parse } from 'date-fns';

import { FireService } from '../services/fire.service';
import { Drop } from '../model/drop';

@Component({
  selector: 'oos-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.css']
})
export class TaskDetailComponent implements OnInit {

    drop: Drop = new Drop();
    dropDate: string = "";
    recurrences: Array<{ value: string, text: string }> = [ 
        { value: "day", text: "Daily"}, 
        { value: "week", text: "Weekly"}, 
        { value: "month", text: "Monthly"}, 
        { value: "year", text: "Yearly"}
    ]

    constructor(
        private dropsService: FireService, 
        private route: ActivatedRoute, 
        private router: Router) { 
        
        this.drop = new Drop({ task: {title: "", date: null, completed: false}, recurrence: 'none'});
    }

    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap( params => {
                let id = params.get("id");
                return id === "new" ? of(new Drop({ ...this.drop, 
                    text: "", 
                    type: "TASK",
                    tags: [],
                    date: this.dropsService.date2ts(new Date()),
                    recurrence: 'none',
                    task: {
                        title: "",
                        date: null,
                        completed: false
                    } })) : this.dropsService.docWithId$("drops/"+id);
            })
        ).subscribe( d => {this.drop = d; this.dropDate =  format(d.date.toDate(),"YYYY-MM-DDTHH:mm:ssZ")})
    }

    addTask() {
        this.dropsService.add("drops",{...this.drop, date: this.dropsService.date2ts(parse(this.dropDate))}).then(
            (value) => { this.router.navigate(["home"]) },
            (error) => { /*this.presentToast(error);*/ this.router.navigate(["home"]); }
        );
    }
    
    updateTask() {
        let id = this.drop.id;
        if (delete this.drop.id)
            console.log(this.dropDate);
            console.log(parse(this.dropDate));
            this.drop.date = this.dropsService.date2ts(parse(this.dropDate));
            console.log(this.drop.date.toDate());
            this.dropsService.update("drops/"+ id, this.drop ).then( 
                (value) => { this.router.navigate(["home"]) },
                (error) => { console.log("error") }
            );
    }


    selectedTags(tags: Array<string>) {
        this.drop.tags = tags;
    }

}
