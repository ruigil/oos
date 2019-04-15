import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';
import { HomePageModule } from '../home/home.module';

import { TaskDetailComponent } from './task-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsModule,
    HomePageModule,
    RouterModule.forChild([
      {
        path: 'edit/:id',
        component: TaskDetailComponent
      }
    ])
  ],
  declarations: [
      TaskDetailComponent
  ]
})
export class TaskModule {}