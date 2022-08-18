import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OOSCommonModule } from '../common.module';

import { TagsComponent } from './tags.component';
import { DeleteTagDialog } from './DeleteTagDialog';

@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule
  ],
  declarations: [TagsComponent, DeleteTagDialog],
  exports: [ TagsComponent ]
})
export class TagsModule {}