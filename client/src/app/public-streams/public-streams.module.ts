import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common.module';

import { PublicStreamComponent } from './public-stream.component';
import { DropListComponent } from './drop-list/drop-list.component';
import { OOSSkinComponent } from './oos-skin/oos-skin.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule,
    RouterModule.forChild([
        {
          path: ':uid/:name',
          component: PublicStreamComponent
        }
    ]),
  
  ],
  declarations: [PublicStreamComponent, DropListComponent, OOSSkinComponent ],
})
export class PublicStreamsModule {}