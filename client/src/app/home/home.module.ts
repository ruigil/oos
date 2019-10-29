import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common/common.module';

import { RouterModule } from '@angular/router'; 

import { HomeComponent } from './home.component';

@NgModule({
  imports: [
    CommonModule, 
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent 
      }
    ])
  ],
  declarations: [ HomeComponent ]
})
export class HomePageModule {}
