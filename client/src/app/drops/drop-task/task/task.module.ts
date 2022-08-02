import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../../../common/common.module';

import { TagsModule } from '../../../tags/tags.module';

import { RouterModule } from '@angular/router';

import { TaskDetailComponent } from './task-detail.component';
 
@NgModule({
  imports: [
    CommonModule,
    TagsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: TaskDetailComponent
      }
    ])
  ],
  declarations: [
      TaskDetailComponent 
  ]
})
export class TaskModule {}