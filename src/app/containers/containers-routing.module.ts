import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { administrationRootRoute } from './administration/administration-routing.module';

import { homeRootRoute } from './home/home-routing.module';

export const containersRootRoute = 'containers';

const routes: Routes = [
  {
    path: '',
    redirectTo: homeRootRoute,
    pathMatch: 'full'
  },
  {
    path: homeRootRoute,
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: administrationRootRoute,
    loadChildren: () =>
      import('./administration/administration.module').then(m => m.AdministrationModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainersRoutingModule { }
