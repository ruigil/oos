import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { TagsModule } from '../tags/tags.module';

import { TransactionComponent } from './transaction.component';
import { TransactionDetailComponent } from './transaction-detail.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TagsModule,
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
  declarations: [TransactionComponent, TransactionDetailComponent]
})
export class TransactionModule {}