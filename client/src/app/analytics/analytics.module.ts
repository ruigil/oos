import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';
import { TagsStatsComponent } from './tags-stats.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: AnalyticsComponent
      },
      {
        path: 'notes/:month/:year',
        component: TagsStatsComponent
      }
    ])
  ],
  declarations: [AnalyticsComponent, TagsStatsComponent]
})
export class AnalyticsModule {}