import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OOSCommonModule } from '../../common.module';

import { StreamsModule } from '../../streams/streams.module';

import { DropRateDetailComponent } from './drop-rate-detail/drop-rate-detail.component';
import { DropRateComponent } from './drop-rate.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    OOSCommonModule,
    StreamsModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: DropRateDetailComponent
      }
    ])
  ],
  declarations: [ DropRateDetailComponent, DropRateComponent ],
  exports: [ DropRateComponent ]
})
export class DropRateModule {}