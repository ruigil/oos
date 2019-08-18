import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../model/settings';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

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

  settings: Settings = new Settings({ transaction: { currency: ""}, home: { preview: "day", timezone: new Date().getTimezoneOffset()/60}, system: { day: true, analytics: false } } );

  constructor(
      private settingsService: SettingsService,
      public snackBar: MatSnackBar ) { 
      
      settingsService.getSettings().subscribe( set => { 
          this.settings = set;
      } );
  }

  saveSettings() {
      this.settingsService.saveSettings(this.settings).then(
          (value) => this.snackBar.open("Settings saved", '', { duration: 5000 }),
          (error) => console.log("error")
      );
  }

  ngOnInit() {
  }

}
