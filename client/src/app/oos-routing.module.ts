import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StartComponent } from './start/start.component';

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
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule )
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then( m => m.SettingsModule )
  },
  {
    path: 'note',
    loadChildren: () => import('./drops/drop-note/note/note.module').then( m => m.NoteModule )
  },
  {
    path: 'money',
    loadChildren: () => import('./drops/drop-money/money/money.module').then( m => m.MoneyModule )
  },
  {
    path: 'task',
    loadChildren: () => import('./drops/drop-task/task/task.module').then( m => m.TaskModule )
  },
  {
    path: 'rate',
    loadChildren: () => import('./drops/drop-rate/rate/rate.module').then( m => m.RateModule )
  },
  {
    path: 'goal',
    loadChildren: () => import('./drops/drop-goal/goal/goal.module').then( m => m.GoalModule )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class OOSRoutingModule {}
