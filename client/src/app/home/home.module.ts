import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { OOSCommonModule } from '../common.module';
import { DropsModule } from '../drops/drops.module';
import { StreamsModule } from '../streams/streams.module';

import { HomeComponent } from './home.component';


@NgModule({
  imports: [
    CommonModule, 
    OOSCommonModule,
    DropsModule,
    StreamsModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent 
      }
    ])
  ],
  providers: [],
  declarations: [ HomeComponent ]
})
export class HomePageModule {}
