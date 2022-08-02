import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common/common.module';
import { DropsComponent } from './drops.component';
import { DropNoteComponent } from './drop-note/drop-note.component';
import { DropMoneyComponent } from './drop-money/drop-money.component';
import { DropTaskComponent } from './drop-task/drop-task.component';
import { DropRateComponent } from './drop-rate/drop-rate.component';
import { DropGoalComponent } from './drop-goal/drop-goal.component';
import { DropSystemComponent } from './drop-system/drop-system.component';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule
  ],
  declarations: [ DropsComponent, DropNoteComponent, DropMoneyComponent, DropTaskComponent, DropRateComponent, DropGoalComponent, DropSystemComponent ],
  exports: [ DropsComponent ]
})
export class DropsModule {}