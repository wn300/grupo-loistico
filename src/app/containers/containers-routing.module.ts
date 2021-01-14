import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AngularFireAuthGuard,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

import { administrationRootRoute } from './administration/administration-routing.module';
import { authenticationRootRoute } from './authentication/authentication-routing.module';
import { homeRootRoute } from './home/home-routing.module';
import { reportsRootRoute } from './reports/reports-routing.module';
import { programmingRootRoute } from './programming/programming-routing.module';
import { newsRootRoute } from './news/news-routing.module';
import { ModuleGuard } from '../core/guards/permissions.guard';
import { MODULE } from '../constants/app.constants';

export const containersRootRoute = 'containers';
const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo([`${containersRootRoute}/${authenticationRootRoute}`]);

const routes: Routes = [
  {
    path: '',
    redirectTo: homeRootRoute,
    pathMatch: 'full',
  },
  {
    path: authenticationRootRoute,
    loadChildren: () =>
      import('./authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: homeRootRoute,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
    loadChildren: () => import('./home/home.module').then((m) => m.HomeModule),
  },
  {
    path: administrationRootRoute,
    canActivate: [AngularFireAuthGuard, ModuleGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin,
      modulePermission: MODULE.management },
    loadChildren: () =>
      import('./administration/administration.module').then(
        (m) => m.AdministrationModule
      ),
  },
  {
    path: programmingRootRoute,
    canActivate: [AngularFireAuthGuard, ModuleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      modulePermission: MODULE.programming,
    },
    loadChildren: () =>
      import('./programming/programming.module').then(
        (m) => m.ProgrammingModule
      ),
  },
  {
    path: newsRootRoute,
    canActivate: [AngularFireAuthGuard, ModuleGuard],
    data: {
      authGuardPipe: redirectUnauthorizedToLogin,
      modulePermission: MODULE.news,
    },
    loadChildren: () => import('./news/news.module').then((m) => m.NewsModule),
  },
  {
    path: reportsRootRoute,
    canActivate: [AngularFireAuthGuard, ModuleGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin,
      modulePermission: MODULE.reports, },
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContainersRoutingModule {}
