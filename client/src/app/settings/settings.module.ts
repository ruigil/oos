import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OOSCommonModule } from '../common/common.module';

import { RouterModule } from '@angular/router';

import { SettingsComponent } from './settings.component';


@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule, 
    RouterModule.forChild([
      {
        path: '', 
        component: SettingsComponent
      }
    ])
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule {}