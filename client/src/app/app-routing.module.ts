import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'analytics',
    loadChildren: './analytics/analytics.module#AnalyticsComponentModule'
  },
  {
    path: 'tags',
    loadChildren: './tags/tags.module#TagsModule'
  },
  {
    path: 'settings',
    loadChildren: './analytics/analytics.module#AnalyticsComponentModule'
  },
  {
    path: 'note',
    loadChildren: './note/note.module#NoteModule'
  },
  {
    path: 'transaction',
    loadChildren: './transaction/transaction.module#TransactionModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
