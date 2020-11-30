import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { Routes, RouterModule } from '@angular/router';
import { authenticationRootRoute } from '../authentication/authentication-routing.module';
import { containersRootRoute } from '../containers-routing.module';
import { HomeComponent } from './home.component';

export const homeRootRoute = 'home';
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([`${containersRootRoute}/${authenticationRootRoute}`]);

const routes: Routes = [
 {
  path: '',
  canActivate: [AngularFireAuthGuard],
  data: { authGuardPipe: redirectUnauthorizedToLogin },
  component: HomeComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
