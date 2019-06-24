import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagsModule } from '../tags/tags.module';

import { RouterModule } from '@angular/router';

import { NoteDetailComponent } from './note-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TagsModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: NoteDetailComponent
      }
      
    ])
  ],
  declarations: [NoteDetailComponent]
})
export class NoteModule {}