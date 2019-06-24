import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common/common.module';

import { RouterModule } from '@angular/router';


import { TagsComponent } from './tags.component';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit',
        component: TagsComponent
      }
    ])
  ],
  declarations: [TagsComponent],
  exports: [ TagsComponent, OOSCommonModule ]
})
export class TagsModule {}