import { Component, AfterViewInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Settings } from '../model/settings';
import { OceanOSService } from '../services/ocean-os.service';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements AfterViewInit {

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
    settings: Settings = new Settings();
    btnDisabled: boolean = false;

    constructor(
        private oos: OceanOSService,
        private router: Router,
        private snackbar: MatSnackBar) { 
        
        this.oos.settings().subscribe( s => this.settings = s);
    }

    saveSettings() {
        this.btnDisabled = true;
        this.oos.saveSettings(this.settings).then(
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

    ngAfterViewInit() {
        this.oos.getSettings();
    }

}
