import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';
import { HomePageModule } from '../home/home.module';

import { TransactionComponent } from './transaction.component';
import { TransactionDetailComponent } from './transaction-detail.component';
import { Iso8601Pipe } from '../iso8601.pipe';

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
        component: TransactionComponent
      },
      {
        path: 'edit/:id',
        component: TransactionDetailComponent
      }
    ])
  ],
  declarations: [
      TransactionComponent, 
      TransactionDetailComponent,
      Iso8601Pipe
  ]
})
export class TransactionModule {}