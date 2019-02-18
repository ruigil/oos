import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { TagsComponent } from './tags.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: 'edit',
        component: TagsComponent
      }
    ])
  ],
  declarations: [TagsComponent],
  exports: [TagsComponent]
})
export class TagsModule {}