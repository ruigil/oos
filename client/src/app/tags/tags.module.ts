import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common/common.module';

import { RouterModule } from '@angular/router';


import { TagsComponent } from './tags.component';
import { TagsPageComponent } from './tags-page.component';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit',
        component: TagsPageComponent
      }
    ])
  ],
  declarations: [TagsComponent, TagsPageComponent],
  exports: [ TagsComponent, OOSCommonModule ]
})
export class TagsModule {}