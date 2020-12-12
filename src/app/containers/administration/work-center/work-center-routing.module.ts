import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkCenterComponent } from './work-center.component';

export const workCenterRootRoute = 'work_center';

const routes: Routes = [
 {
  path: '',
  component: WorkCenterComponent,
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkCenterRoutingModule { }
