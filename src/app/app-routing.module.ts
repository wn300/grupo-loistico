import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { containersRootRoute } from './containers/containers-routing.module';
import { authenticationRootRoute } from './containers/authentication/authentication-routing.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: `${containersRootRoute}/${authenticationRootRoute}`,
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
