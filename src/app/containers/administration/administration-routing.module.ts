import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { clientRootRoute } from './client/client-routing.module';
import { companyRootRoute } from './company/company-routing.module';
import { deleteFilesRootRoute } from './delete-files/delete-files-routing.module';
import { peopleRootRoute } from './people/people-routing.module';
import { workCenterRootRoute } from './work-center/work-center-routing.module';
import { typesNewsRootRoute } from './types-news/types-news-routing.module';
import { ManagementGuard } from './guards/permissions.guard';
import { MODULE } from 'src/app/constants/app.constants';

export const administrationRootRoute = 'administration';

const routes: Routes = [
  {
    path: '',
    redirectTo: peopleRootRoute,
    pathMatch: 'full',
  },
  {
    path: peopleRootRoute,
    loadChildren: () =>
      import('./people/people.module').then((m) => m.PeopleModule),
    canActivate: [ManagementGuard],
    data: {
      modulePermission: MODULE.people,
    },
  },
  {
    path: companyRootRoute,
    loadChildren: () =>
      import('./company/company.module').then((m) => m.CompanyModule),
    canActivate: [ManagementGuard],
    data: {
      modulePermission: MODULE.companies,
    },
  },
  {
    path: clientRootRoute,
    loadChildren: () =>
      import('./client/client.module').then((m) => m.ClientModule),
    canActivate: [ManagementGuard],
    data: {
      modulePermission: MODULE.clients,
    },
  },
  {
    path: workCenterRootRoute,
    loadChildren: () =>
      import('./work-center/work-center.module').then(
        (m) => m.WorkCenterModule
      ),
    canActivate: [ManagementGuard],
    data: {
      modulePermission: MODULE.workCenters,
    },
  },
  {
    path: deleteFilesRootRoute,
    loadChildren: () =>
      import('./delete-files/delete-files.module').then(
        (m) => m.DeleteFilesModule
      ),
    canActivate: [ManagementGuard],
    data: {
      modulePermission: MODULE.images,
    },
  },
  {
    path: typesNewsRootRoute,
    loadChildren: () =>
      import('./types-news/types-news.module').then((m) => m.TypesNewsModule),
    canActivate: [ManagementGuard],
    data: {
      modulePermission: MODULE.newTypes,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
