import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { administrationRootRoute } from './administration/administration-routing.module';
import { authenticationRootRoute } from './authentication/authentication-routing.module';
import { homeRootRoute } from './home/home-routing.module';
import { reportsRootRoute } from './reports/reports-routing.module';
import { programmingRootRoute } from './programming/programming-routing.module';

export const containersRootRoute = 'containers';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([`${containersRootRoute}/${authenticationRootRoute}`]);

const routes: Routes = [
  {
    path: '',
    redirectTo: homeRootRoute,
    pathMatch: 'full'
  },
  {
    path: authenticationRootRoute,
    loadChildren: () =>
      import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: homeRootRoute,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () =>
      import('./home/home.module').then(m => m.HomeModule)
  },
  {
    path: administrationRootRoute,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () =>
      import('./administration/administration.module').then(m => m.AdministrationModule)
  },
  {
    path: programmingRootRoute,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () =>
      import('./programming/programming.module').then(m => m.ProgrammingModule)
  },
  {
    path: reportsRootRoute,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () =>
      import('./reports/reports.module').then(m => m.ReportsModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContainersRoutingModule { }
