import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';
import { HomePageModule } from '../home/home.module';

import { TaskComponent } from './task.component';
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
        path: ':id', 
        component: TaskComponent
      },
      {
        path: 'edit/:id',
        component: TaskDetailComponent
      }
    ])
  ],
  declarations: [
      TaskComponent, 
      TaskDetailComponent
  ]
})
export class TaskModule {}