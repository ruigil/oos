import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common.module';
import { DropsComponent } from './drops.component';

import { RouterModule } from '@angular/router';
import { DropTextModule } from './drop-text/drop-text.module';
import { DropTaskModule } from './drop-task/drop-task.module';
import { DropRateModule } from './drop-rate/drop-rate.module';
import { DropImageModule } from './drop-image/drop-image.module';
import { DropMoneyModule } from './drop-money/drop-money.module';
import { DropGoalModule } from './drop-goal/drop-goal.module';

import { DropSystemComponent } from './drop-system/drop-system.component';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule,
    DropTextModule,
    DropTaskModule,
    DropRateModule,
    DropImageModule,
    DropMoneyModule,
    DropGoalModule,
    RouterModule.forChild([
      {
        path: 'text',
        loadChildren: () => import('./drop-text/drop-text.module').then( m => m.DropTextModule )
      },
      {
        path: 'image',
        loadChildren: () => import('./drop-image/drop-image.module').then( m => m.DropImageModule )
      },
      {
        path: 'money',
        loadChildren: () => import('./drop-money/drop-money.module').then( m => m.DropMoneyModule )
      },
      {
        path: 'task',
        loadChildren: () => import('./drop-task/drop-task.module').then( m => m.DropTaskModule )
      },
      {
        path: 'rate',
        loadChildren: () => import('./drop-rate/drop-rate.module').then( m => m.DropRateModule )
      },
      {
        path: 'goal',
        loadChildren: () => import('./drop-goal/drop-goal.module').then( m => m.DropGoalModule )
      }      
    ])
  ],
  declarations: [ 
    DropsComponent, 
    DropSystemComponent
  ],
  exports: [ DropsComponent ]
})
export class DropsModule {}