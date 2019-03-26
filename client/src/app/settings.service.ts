import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { FireService } from './fire.service';
import { Settings } from './settings'

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: Settings;

  constructor(private fireService: FireService) { 
      this.settings = new Settings()
  }

  getSettings(): Observable<Settings> {
      return this.fireService.doc$("settings/settings");
  }

  saveSettings(settings: Settings) {
      return this.fireService.update("settings/settings",settings);
  }
}
