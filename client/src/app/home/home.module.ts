import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common/common.module';

import { RouterModule } from '@angular/router'; 
import { TagFilterComponent } from '../tag-filter/tag-filter.component';
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
  declarations: [ HomeComponent, TagFilterComponent ]
})
export class HomePageModule {}
