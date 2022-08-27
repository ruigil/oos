import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common.module';

import { DropsModule } from '../drops/drops.module';
import { RouterModule } from '@angular/router';

import { PublicStreamComponent } from './public-stream.component';
import { OOSSkinComponent } from './oos-skin/oos-skin.component';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule,
    DropsModule,
    RouterModule.forChild([
        {
          path: ':uid/:name',
          component: PublicStreamComponent
        }
    ]),
  
  ],
  declarations: [PublicStreamComponent, OOSSkinComponent ],
})
export class PublicStreamsModule {}