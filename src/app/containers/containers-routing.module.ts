import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { exampleOneRootRoute } from './example-one/example-one-routing.module';
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
    path: exampleOneRootRoute,
    loadChildren: () =>
      import('./example-one/example-one.module').then(m => m.ExampleOneModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainersRoutingModule { }
