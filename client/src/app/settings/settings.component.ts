import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { Settings } from '../model/settings';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'oos-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  settings: Settings = new Settings({ transaction: { currency: ""}, home: { preview: "day", timezone: new Date().getTimezoneOffset()/60 } });

  constructor(
      private settingsService: SettingsService,
      public toastController: ToastController) { 
      
      settingsService.getSettings().subscribe( set => { 
          this.settings = set;
      } );
  }

  saveSettings() {
      this.settingsService.saveSettings(this.settings).then(
          (value) => this.presentToast(),
          (error) => console.log("error")
      );
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your settings have been saved.',
      duration: 2000
    });
    toast.present();
  }

  ngOnInit() {
  }

}
