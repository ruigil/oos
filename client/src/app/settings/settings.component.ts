import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../model/settings';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit, OnDestroy {

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

    settings: Settings = new Settings({ transaction: { currency: ""}, home: { preview: "day", timezone: new Date().getTimezoneOffset() }, system: { day: true, analytics: false } } );
    btnDisabled: boolean = false;
    subs: Subscription = new Subscription();

  constructor(
      private settingsService: SettingsService,
      public snackBar: MatSnackBar,
      private location: Location) { 
      
      this.subs.add(settingsService.getSettings().subscribe( set => { 
          this.settings = set;
      } ));
  }

  saveSettings() {
      this.btnDisabled = true;
      this.settingsService.saveSettings(this.settings).then(
          (value) => { this.snackBar.open("Settings saved", '', { duration: 5000 }); this.btnDisabled = false },
          (error) => { this.snackBar.open(`Error saving settings [${error}]`, '', { duration: 5000 }); this.btnDisabled = false }
      );
  }

  ngOnInit() {
  }
  
  goBack() {
    this.location.back();
  }

    ngOnDestroy() {
        this.subs.unsubscribe();
    }

}
