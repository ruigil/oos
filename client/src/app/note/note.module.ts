import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';
import { HomePageModule } from '../home/home.module';

import { NoteComponent } from './note.component';
import { NoteDetailComponent } from './note-detail.component';
import { ShowdownPipe } from '../pipes/showdown.pipe';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsModule,
    HomePageModule,
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
  declarations: [NoteComponent, NoteDetailComponent, ShowdownPipe]
})
export class NoteModule {}