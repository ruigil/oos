import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../../../common.module';

import { TagsModule } from '../../../tags/tags.module';

import { RouterModule } from '@angular/router';

import { PhotoDetailComponent } from './photo-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TagsModule,
    OOSCommonModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: PhotoDetailComponent
      }
      
    ])
  ],
  declarations: [PhotoDetailComponent]
})
export class PhotoModule {}