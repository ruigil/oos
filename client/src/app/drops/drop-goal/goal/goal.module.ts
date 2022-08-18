import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OOSCommonModule } from '../../../common.module';
import { TagsModule } from '../../../tags/tags.module';
import { GoalDetailComponent } from './goal-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TagsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: GoalDetailComponent
      }
      
    ])
  ],
  declarations: [GoalDetailComponent]
})
export class GoalModule {}