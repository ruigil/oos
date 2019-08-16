import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsModule } from '../tags/tags.module';

import { RouterModule } from '@angular/router';

import { GoalComponent } from './goal.component';

@NgModule({
  imports: [
    CommonModule,
    TagsModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: GoalComponent
      }
      
    ])
  ],
  declarations: [GoalComponent]
})
export class GoalModule {}