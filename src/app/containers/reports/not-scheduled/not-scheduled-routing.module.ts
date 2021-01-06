import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotScheduledComponent } from './not-scheduled.component';

export const notScheduledRootRoute = 'not-scheduled';

const routes: Routes = [
 {
  path: '',
  component: NotScheduledComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotScheduledRoutingModule { }
