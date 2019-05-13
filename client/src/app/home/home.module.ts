import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';

import { FormatDatePipe } from '../pipes/format-date.pipe';
import { HomeComponent } from './home.component';
import {
  MdcFabModule,
  MdcIconModule,
  MdcMenuModule,
  MdcButtonModule
} from '@angular-mdc/web';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatButtonModule,
    MdcFabModule,
    MdcIconModule,
    MdcMenuModule,
    MdcButtonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent
      }
    ])
  ],
  declarations: [HomeComponent, FormatDatePipe],
  exports: [FormatDatePipe]
})
export class HomePageModule {}
