import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StartComponent } from './start/start.component';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'start',
    component: StartComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'home',
    canActivate: [ AuthGuard ],
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'tags',
    canActivate: [ AuthGuard ],
    loadChildren: './tags/tags.module#TagsModule'
  },
  {
    path: 'settings',
    canActivate: [ AuthGuard ],
    loadChildren: './settings/settings.module#SettingsModule'
  },
  {
    path: 'note',
    canActivate: [ AuthGuard ],
    loadChildren: './note/note.module#NoteModule'
  },
  {
    path: 'transaction',
    canActivate: [ AuthGuard ],
    loadChildren: './transaction/transaction.module#TransactionModule'
  },
  {
    path: 'task',
    canActivate: [ AuthGuard ],
    loadChildren: './task/task.module#TaskModule'
  },
  {
    path: 'rate',
    canActivate: [ AuthGuard ],
    loadChildren: './rate/rate.module#RateModule'
  },
  {
    path: 'goal',
    canActivate: [ AuthGuard ],
    loadChildren: './goal/goal.module#GoalModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OOSRoutingModule {}
