import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';

import { AnalyticsComponent } from './analytics.component';
import { TagsStatsComponent } from './tags-stats.component';
import { MonthNamesPipe } from '../pipes/month-names.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatListModule,
    MatCardModule,
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