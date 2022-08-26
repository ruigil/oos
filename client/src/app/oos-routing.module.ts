import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicStreamComponent } from './public-stream/public-stream.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'stream/:uid/:name', 
    component: PublicStreamComponent,
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule )
  },
  {
    path: 'settings',
    loadChildren: () => import('./users/users.module').then( m => m.UsersModule )
  },
  {
    path: 'drop',
    loadChildren: () => import('./drops/drops.module').then( m => m.DropsModule )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OOSRoutingModule {}
