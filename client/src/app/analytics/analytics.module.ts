import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common/common.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { RouterModule } from '@angular/router';

import { AnalyticsComponent } from './analytics.component';
import { TagsStatsComponent } from './tags-stats.component';
import { MonthNamesPipe } from '../pipes/month-names.pipe';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule,
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
  declarations: [AnalyticsComponent, TagsStatsComponent, MonthNamesPipe]
})
export class AnalyticsModule {}