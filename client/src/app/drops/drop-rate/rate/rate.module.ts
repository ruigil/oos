import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OOSCommonModule } from '../../../common.module';

import { TagsModule } from '../../../tags/tags.module';

import { RateDetailComponent } from './rate-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OOSCommonModule,
    TagsModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: RateDetailComponent
      }
    ])
  ],
  declarations: [
      RateDetailComponent
  ]
})
export class RateModule {}