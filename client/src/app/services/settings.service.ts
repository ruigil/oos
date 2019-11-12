import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, switchMap, share } from 'rxjs/operators';

import { FireService } from './fire.service';
import { Settings } from '../model/settings'
import { AuthService } from './auth.service';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  settings: Settings;
  user: any;
  settings$: Subject<Settings> = new Subject<Settings>();

  constructor(private fireService: FireService, private authService: AuthService) { 
      this.settings = new Settings({ home:{ preview: 'day', timezone: -2 }, system: { day: true, analytics: true }, transaction: { currency: 'CHF'} })
  }

  getSettings(): Observable<Settings> {
      return this.authService.user().pipe( switchMap(u => {
          this.user = u;
          return this.fireService.doc$("settings/"+u.uid).pipe( map( (s:Settings) => s ? {...s, uid: u.uid } : {...this.settings, uid: u.uid }) )
      }), share());
  }

  saveSettings(sets: Settings) {
      return this.fireService.set("settings/"+this.user.uid, sets );
  }
}
