import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { appUsersRootRoute } from './app-users/app-users-routing.module';
import { programmingRootRoute } from './programming/programming-routing.module';

export const reportsRootRoute = 'reports';

const routes: Routes = [
  {
    path: '',
    redirectTo: reportsRootRoute,
    pathMatch: 'full'
  },
  {
    path: appUsersRootRoute,
    loadChildren: () =>
      import('./app-users/app-users.module').then(m => m.AppUsersModule)
  },
  ,
  {
    path: programmingRootRoute,
    loadChildren: () =>
      import('./programming/programming.module').then(m => m.ProgrammingModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
