import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { containersRootRoute } from './containers/containers-routing.module';

import { homeRootRoute } from './containers/home/home-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${containersRootRoute}/${homeRootRoute}`,
    pathMatch: 'full'
  },
  {
    path: containersRootRoute,
    loadChildren: () =>
      import('./containers/containers.module').then(m => m.ContainersModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled',
    useHash: true,
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
