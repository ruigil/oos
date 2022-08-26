import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OOSCommonModule } from '../../common.module';
import { StreamsModule } from '../../streams/streams.module';

import { DropMoneyDetailComponent } from './drop-money-detail/drop-money-detail.component';
import { DropMoneyComponent } from './drop-money.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OOSCommonModule,
    StreamsModule,

    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: DropMoneyDetailComponent
      }
    ])
  ],
  declarations: [ DropMoneyDetailComponent, DropMoneyComponent],
  exports: [ DropMoneyComponent ]
})
export class DropMoneyModule {}