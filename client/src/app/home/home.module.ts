import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { OOSCommonModule } from '../common/common.module';
import { DropsModule } from '../drops/drops.module';
import { TagsModule } from '../tags/tags.module';

import { HomeComponent } from './home.component';
import { DateTimeService } from '../services/date-time.service';


@NgModule({
  imports: [
    CommonModule, 
    OOSCommonModule,
    DropsModule,
    TagsModule,
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
