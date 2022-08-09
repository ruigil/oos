import { Component, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from '../model/user';
import { OceanOSService } from '../services/ocean-os.service';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

    public currencies:Array<any> = [ 
        {name: "Swiss Franc", value:"CHF"},
        {name: "Euro", value:"EUR"},
        {name: "Dollar", value:"USD"},
        {name: "Pound", value:"GBP"}
    ];
    public previews:Array<any> = [ 
        {name: "Day", value:"day"},
        {name: "Week", value:"week"},
        {name: "Month", value:"month"},
        {name: "Year", value:"year"}
    ];
    public timezones:Array<any> = ["Europe/Zurich","Europe/Lisbon","Europe/Paris","Europe/Berlin"];
    user: User = new User({ id: "oos", username: "oos"});
    btnDisabled: boolean = false;

    constructor(
        private oos: OceanOSService,
        private router: Router,
        private snackbar: MatSnackBar) { 
        
        this.oos.settings().subscribe( s => {
            this.user = s
        });
    }

    saveSettings() {
        this.btnDisabled = true;
        this.oos.putSettings(this.user).then(
            (value) => {
                this.snackbar
                .open(`The settings were successfully saved`,"OK")
                .afterDismissed().subscribe( s => this.router.navigate(["home"]) );
            },
            (error) => { 
                this.snackbar
                .open(`The seetings were NOT saved. Error [${error}]`,'OK')
                .afterDismissed().subscribe( s => this.btnDisabled = false );
            }
        );
    }

}
