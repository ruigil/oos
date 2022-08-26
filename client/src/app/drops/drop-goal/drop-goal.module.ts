import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { OOSCommonModule } from '../../common.module';
import { StreamsModule } from '../../streams/streams.module';
import { DropGoalDetailComponent } from './drop-goal-detail/drop-goal-detail.component';
import { DropGoalComponent } from './drop-goal.component';

@NgModule({
  imports: [
    CommonModule,
    StreamsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: DropGoalDetailComponent
      }
      
    ])
  ],
  declarations: [DropGoalDetailComponent, DropGoalComponent],
  exports: [ DropGoalComponent ]
})
export class DropGoalModule {}