import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { AnalyticsComponent } from './analytics.component';
import { TagsStatsComponent } from './tags-stats.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxChartsModule,
    RouterModule.forChild([
      {
        path: '',
        component: AnalyticsComponent
      },
      {
        path: ':month/:year',
        component: TagsStatsComponent
      }
    ])
  ],
  declarations: [AnalyticsComponent, TagsStatsComponent]
})
export class AnalyticsModule {}