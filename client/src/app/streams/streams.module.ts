import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common.module';

import { StreamsComponent } from './streams.component';
import { DeleteStreamDialog } from './delete-stream-dialog';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule
  ],
  declarations: [StreamsComponent, DeleteStreamDialog],
  exports: [ StreamsComponent ]
})
export class StreamsModule {}