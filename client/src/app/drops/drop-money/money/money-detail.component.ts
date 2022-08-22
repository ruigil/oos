import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, take } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DateTimeService } from '../../../services/date-time.service';
import { OceanOSService } from 'src/app/services/ocean-os.service';

import { Tag } from '../../../model/tag';
import { Drop } from '../../../model/drop';
import { User } from 'src/app/model/user';

@Component({
  selector: 'oos-money-detail',
  templateUrl: './money-detail.component.html',
  styleUrls: ['./money-detail.component.scss']
})
export class MoneyDetailComponent {

    drop: Drop = new Drop({content: { value: 0, type: "", currency: "" } });
    user: User = new User();
    btnDisabled: boolean = false;
    dateISO:string = "";
    recurrences: Array<{key:string, value:string}> = [];
    field = new FormControl('', [
        Validators.required,
    ]);    

    constructor(
        private oos: OceanOSService, 
        private route: ActivatedRoute, 
        private router: Router,
        private dts: DateTimeService,
        private snackbar: MatSnackBar) { 
        
        // TODO: combine the two observer with settings and add option in the form
        this.recurrences = this.dts.getRecurrences();
        this.oos.settings().pipe(distinctUntilChanged()).subscribe( s =>  this.user = s );
        combineLatest([this.oos.tags(), this.oos.drops(), this.route.paramMap]).pipe(take(1)).subscribe( v => {
            let id:string = v[2].get("id") || "new";
            
            this.drop = id === 'new' ? new Drop({
                _id: "new",
                title: "", 
                type: "MONEY",
                text: "",
                content: { value: 0, type: "expense", currency: "" },
                recurrence: "none",
                tags: [this.oos.getTag("MONEY_TYPE")],
                date: this.dts.getTimestamp(new Date())
            }) : this.oos.getDrop(id);

            this.dateISO = this.dts.getDateISO(this.drop.date);

        });
    }

    dropData(id:string) {
        const op = id ? "updated" :"added";
        const type = "transaction";
        this.btnDisabled = true;
        this.drop.date = this.dts.getTimestamp(this.dateISO);
        this.drop.content!.currency = this.user.settings.currency;
        this.oos.putDrop(this.drop).then(
            (value) => {
                this.snackbar
                .open(`The ${type} was successfully ${op}`,"OK")
                .afterDismissed().subscribe( s => this.router.navigate(["home"]) );
            },
            (error) => { 
                this.snackbar
                .open(`The ${type} was NOT ${op}. Error [${error}]`,'OK')
                .afterDismissed().subscribe( s => this.btnDisabled = false );
            }
        );
    }

    selectedTags(tags: Array<Tag>) {
        this.drop.tags = tags;
    }

}
