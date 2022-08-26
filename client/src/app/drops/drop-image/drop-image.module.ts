import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../../common.module';

import { StreamsModule } from '../../streams/streams.module';

import { RouterModule } from '@angular/router';

import { DropImageDetailComponent } from './drop-image-detail/drop-image-detail.component';
import { DropImageComponent } from './drop-image.component';

@NgModule({
  imports: [
    CommonModule,
    StreamsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: DropImageDetailComponent
      }
      
    ])
  ],
  declarations: [DropImageDetailComponent, DropImageComponent],
  exports: [ DropImageComponent]
})
export class DropImageModule {}