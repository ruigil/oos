import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../../common.module';

import { StreamsModule } from '../../streams/streams.module';

import { RouterModule } from '@angular/router';

import { DropTextDetailComponent } from './drop-text-detail/drop-text-detail.component';
import { DropTextComponent } from './drop-text.component';

@NgModule({
  imports: [
    CommonModule,
    StreamsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: DropTextDetailComponent
      },
    ])
  ],
  declarations: [DropTextDetailComponent, DropTextComponent],
  exports: [DropTextComponent]
})
export class DropTextModule {}