import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OOSCommonModule } from '../common.module';

import { RouterModule } from '@angular/router';

import { UsersComponent } from './users.component';


@NgModule({
  imports: [
    CommonModule,
    OOSCommonModule, 
    RouterModule.forChild([
      {
        path: '', 
        component: UsersComponent
      }
    ])
  ],
  declarations: [UsersComponent]
})
export class UsersModule {}