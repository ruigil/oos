import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'public-stream', 
    loadChildren: () => import('./public-streams/public-streams.module').then( m => m.PublicStreamsModule )
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
