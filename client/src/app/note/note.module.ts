import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';

import { NoteComponent } from './note.component';
import { NoteDetailComponent } from './note-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsModule,
    RouterModule.forChild([
      {
        path: '', 
        component: NoteComponent
      },
      {
        path: ':id',
        component: NoteDetailComponent
      }
    ])
  ],
  declarations: [NoteComponent, NoteDetailComponent]
})
export class NoteModule {}