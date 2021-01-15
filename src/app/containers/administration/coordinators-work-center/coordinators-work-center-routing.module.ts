import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CoordinatorsWorkCenterComponent } from './coordinators-work-center.component';

export const coordinatorsWorkCenterRootRoute = 'coordinators_work_center';

const routes: Routes = [
  {
    path: '',
    component: CoordinatorsWorkCenterComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoordinatorsWorkCenterRoutingModule { }
