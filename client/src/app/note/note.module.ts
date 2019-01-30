import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { NoteComponent } from './note.component';
import { NoteDetailComponent } from './note-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
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