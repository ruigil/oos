import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../../common.module';

import { StreamsModule } from '../../streams/streams.module';

import { RouterModule } from '@angular/router';

import { DropTaskDetailComponent } from './drop-task-detail/drop-task-detail.component';
import { DropTaskComponent } from './drop-task.component';

@NgModule({
  imports: [
    CommonModule,
    StreamsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: DropTaskDetailComponent
      }
    ])
  ],
  declarations: [ DropTaskDetailComponent, DropTaskComponent ],
  exports: [ DropTaskComponent ]
})
export class DropTaskModule {}