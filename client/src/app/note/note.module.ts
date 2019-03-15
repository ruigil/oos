import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';

import { NoteComponent } from './note.component';
import { NoteDetailComponent } from './note-detail.component';
import { NewLinePipe } from './new-line.pipe';
import { FormatDatePipe } from '../format-date.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsModule,
    RouterModule.forChild([
      {
        path: ':id', 
        component: NoteComponent
      },
      {
        path: 'edit/:id',
        component: NoteDetailComponent
      }
    ])
  ],
  declarations: [NoteComponent, NoteDetailComponent,NewLinePipe, FormatDatePipe]
})
export class NoteModule {}