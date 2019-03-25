import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { Settings } from '../settings';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private settings: Settings = new Settings({ transaction: { currency: ""}});

  constructor(private settingsService: SettingsService) { 
      settingsService.getSettings().subscribe( set => { this.settings = set; console.log("settings...") });
  }

  saveSettings() {
      this.settingsService.saveSettings(this.settings);
  }

  ngOnInit() {
  }

}
