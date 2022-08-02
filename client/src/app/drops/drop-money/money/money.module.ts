import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OOSCommonModule } from '../../../common/common.module';
import { TagsModule } from '../../../tags/tags.module';

import { MoneyDetailComponent } from './money-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OOSCommonModule,
    TagsModule,

    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: MoneyDetailComponent
      }
    ])
  ],
  declarations: [
      MoneyDetailComponent
  ]
})
export class MoneyModule {}