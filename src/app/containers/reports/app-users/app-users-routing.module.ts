import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppUsersComponent } from './app-users.component';

export const appUsersRootRoute = 'app';

const routes: Routes = [
 {
  path: '',
  component: AppUsersComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppUsersRoutingModule { }
